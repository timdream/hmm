'use strict';

var HMMMatrices = require('./hmm_matrices');
var Utils = require('./hmm_utils.js');

var HiddenMarkovModel = function(aDef, bDef, piDef) {
  var a = this.stateTransitionMatrix =
    new HMMMatrices.HMMStateTransitionMatrix(aDef);
  var b = this.observationProbabilityMatrix =
    new HMMMatrices.HMMObservationProbabilityMatrix(bDef);
  var pi = this.initialStateDistributionMatrix =
    new HMMMatrices.HMMInitialStateDistributionMatrix(piDef);

  if (a.numberOfStates !== b.numberOfStates ||
      a.numberOfStates !== pi.numberOfStates) {
    throw new Error('HiddenMarkovModel: number of states mismatch.');
  }

  this.numberOfStates = a.numberOfStates;
  this.numberOfObservationSymbols = pi.numberOfObservationSymbols;
};

HiddenMarkovModel.prototype.numberOfStates = 0;
HiddenMarkovModel.prototype.numberOfObservationSymbols = 0;

// This is (7) but calculated with log() to prevent underflow.
HiddenMarkovModel.prototype.getProbabilityOfStateSequenceForObservations =
function(x, o) {
  if (x.length !== o.length) {
    throw new Error('HiddenMarkovModel: length mismatch.');
  }

  var a = this.stateTransitionMatrix;
  var b = this.observationProbabilityMatrix;
  var pi = this.initialStateDistributionMatrix;

  var p = Math.log(pi[0][x[0]] * b[x[0]][o[0]]);

  for (var t = 1; t < o.length; t++) {
    p += Math.log(a[x[t - 1]][x[t]]) + Math.log(b[x[t]][o[t]]);
  }

  return Math.exp(p);
};

// This is the solution 1 in chapter 4.1
HiddenMarkovModel.prototype.getProbabilityOfObservations = function(o) {
  var c = this._alphaPass(o).c;
  var logProb = this._getLogProb(c);

  return Math.exp( - logProb);
};

// This finds the dynamic programming solution. See chapter 5.
HiddenMarkovModel.prototype.getMostProbableStateSequencesOfObservations =
function(o) {
  var n = this.numberOfStates;
  var a = this.stateTransitionMatrix;
  var b = this.observationProbabilityMatrix;
  var pi = this.initialStateDistributionMatrix;
  var T = o.length;

  var i, j, t;

  var pathPointers = new Utils.UintSizedArray(n, (T - 1) * n);

  // In the interest of saving memory spaces,
  // we keep only the last delta(t) values instead of the whole series.
  // Keeping the whole series allow us to reproduce Figure 2 though.
  var currentDelta = new Float64Array(n);
  for (i = 0; i < n; i++) {
    currentDelta[i] = Math.log(pi[0][i] * b[i][o[0]]);
  }

  var previousDelta;
  for (t = 1; t < T; t++) {
    previousDelta = currentDelta;
    currentDelta = new Float64Array(n);
    for (i = 0; i < n; i++) {
      currentDelta[i] = -Infinity;
      for (j = 0; j < n; j++) {
        var s =
          previousDelta[j] + Math.log(a[i][j]) + Math.log(b[i][o[t]]);
        if (currentDelta[i] < s) {
          currentDelta[i] = s;
          pathPointers[(t - 1) * n + i] = j;
        }
      }
    }
  }

  var score = -Infinity;
  var stateSequences = new Array(T);

  for (i = 0; i < n; i++) {
    if (score < currentDelta[i]) {
      score = currentDelta[i];
      stateSequences[T - 1] = i;
    }
  }

  t = T - 1;
  var currentState = stateSequences[T - 1];
  while (t--) {
    currentState = stateSequences[t] = pathPointers[t * n + currentState];
  }

  return stateSequences;
};

// This is the 2nd part of chapter 7: The α-pass
HiddenMarkovModel.prototype._alphaPass = function(o) {
  var n = this.numberOfStates;
  var a = this.stateTransitionMatrix;
  var b = this.observationProbabilityMatrix;
  var pi = this.initialStateDistributionMatrix;
  var T = o.length;

  var i, j, t;

  var c = new Float64Array(T);
  var alpha = new Float64Array(T * n);

  c[0] = 0;
  for (i = 0; i < n; i++) {
    alpha[0 * n + i] = pi[0][i] * b[i][o[0]];

    c[0] += alpha[0 * n + i];
  }

  c[0] = 1 / c[0];
  for (i = 0; i < n; i++) {
    alpha[0 * n + i] *= c[0];
  }

  for (t = 1; t < T; t++) {
    c[t] = 0;
    for (i = 0; i < n; i++) {
      alpha[t * n + i] = 0;
      for (j = 0; j < n; j++) {
        alpha[t * n + i] +=
          alpha[(t - 1) * n + j] * a[j][i];
      }
      alpha[t * n + i] *= b[i][o[t]];
      c[t] += alpha[t * n + i];
    }

    c[t] = 1 / c[t];
    for (i = 0; i < n; i++) {
      alpha[t * n + i] *= c[t];
    }
  }

  return {
    c: c,
    alpha: alpha
  };
};

// Part 6 of chapter 7: Compute log[P (O | λ)]
HiddenMarkovModel.prototype._getLogProb = function(c) {
  var T = c.length;

  var logProb = 0;
  for (var t = 0; t < T; t++) {
    logProb += Math.log(c[t]);
  }

  return logProb;
};

module.exports = HiddenMarkovModel;
