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

module.exports = HiddenMarkovModel;
