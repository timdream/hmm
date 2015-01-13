'use strict';

var HMMMatrices = require('./hmm_matrices');

var HiddenMarkovModel = function(matrixA, matrixB, matrixPI) {
  this.stateTransitionMatrix = matrixA;
  this.observationProbabilityMatrix = matrixB;
  this.initialStateDistributionMatrix = matrixPI;

  if (matrixA.numberOfStates !== matrixB.numberOfStates ||
      matrixA.numberOfStates !== matrixPI.numberOfStates) {
    throw new Error('HiddenMarkovModel: number of states mismatch.');
  }

  this.numberOfStates = matrixA.numberOfStates;
  this.numberOfObservationSymbols = matrixPI.numberOfObservationSymbols;
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

  // Should be an UInt array and find the length from |n|
  var pathPointers = new Array((T - 1) * n);

  var delta = new Float64Array(T * n);
  for (var i = 0; i < n; i++) {
    delta[0 * n + i] = Math.log(pi[0][i] * b[i][o[0]]);
  }

  for (var t = 1; t < T; t++) {
    for (var i = 0; i < n; i++) {
      delta[t * n + i] = -Infinity;
      for (var j = 0; j < n; j++) {
        var s =
          delta[(t - 1) * n + j] + Math.log(a[i][j]) + Math.log(b[i][o[t]]);
        if (delta[t * n + i] < s) {
          delta[t * n + i] = s;
          pathPointers[(t - 1) * n + i] = j;
        }
      }
    }
  }

  var score = -Infinity;
  var stateSequences = new Array(T);

  for (var i = 0; i < n; i++) {
    if (score < delta[(T - 1) * n + i]) {
      score = delta[(T - 1) * n + i];
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
