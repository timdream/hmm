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

// This is (7)
HiddenMarkovModel.prototype.getProbabilityOfStateSequenceForObservations =
function(sequenceX, observationsO) {
  if (sequenceX.length !== observationsO.length) {
    throw new Error('HiddenMarkovModel: length mismatch.');
  }

  var p = this.initialStateDistributionMatrix[0][sequenceX[0]] *
    this.observationProbabilityMatrix[sequenceX[0]][observationsO[0]];

  for (var t = 1; t < observationsO.length; t++) {
    p *= this.stateTransitionMatrix[sequenceX[t - 1]][sequenceX[t]] *
      this.observationProbabilityMatrix[sequenceX[t]][observationsO[t]];
  }

  return p;
};

// This finds the dynamic programming solution. See chapter 5.
HiddenMarkovModel.prototype.getMostProbableStateSequencesOfObservations =
function(o) {
  var n = this.numberOfStates;
  var a = this.stateTransitionMatrix;
  var b = this.observationProbabilityMatrix;
  var pi = this.initialStateDistributionMatrix;
  var T = o.length;

  var pathPointers = new Utils.UintSizedArray(n, (T - 1) * n);

  // In the interest of saving memory spaces,
  // we keep only the last delta(t) values instead of the whole series.
  // Keeping the whole series allow us to reproduce Figure 2 though.
  var currentDelta = new Float64Array(n);
  for (var i = 0; i < n; i++) {
    currentDelta[i] = Math.log(pi[0][i] * b[i][o[0]]);
  }

  var previousDelta;
  for (var t = 1; t < T; t++) {
    previousDelta = currentDelta;
    currentDelta = new Float64Array(n);
    for (var i = 0; i < n; i++) {
      currentDelta[i] = -Infinity;
      for (var j = 0; j < n; j++) {
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

  for (var i = 0; i < n; i++) {
    if (score < currentDelta[i]) {
      score = currentDelta[i];
      stateSequences[T - 1] = i;
    }
  }

  var t = T - 1;
  var currentState = stateSequences[T - 1];
  while (t--) {
    currentState = stateSequences[t] = pathPointers[t * n + currentState];
  }

  return stateSequences;
};

module.exports = HiddenMarkovModel;
