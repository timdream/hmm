'use strict';

var Matrix = require('matrixjs');

var StochasticMatrix = function() {
  Matrix.apply(this, arguments);

  Array.prototype.forEach(function(row) {
    var rowSum = row.reduceRight(function(curr, prev) {
      return curr + prev;
    }, 0);

    if (rowSum !== 1) {
      throw new Error('StochasticMatrix: Matrix must be stochastic.');
    }
  });
};

StochasticMatrix.prototype = Object.create(Matrix);

// This is matrix labelled as "A"
var HMMStateTransitionMatrix = function() {
  StochasticMatrix.apply(this, arguments);

  if (this.rows !== this.cols) {
    throw new Error('HMMStateTransitionMatrix: Must be a square matrix.');
  }

  // This is "N"
  this.numberOfStates = this.rows;
};

HMMStateTransitionMatrix.prototype = Object.create(StochasticMatrix);
HMMStateTransitionMatrix.prototype.numberOfStates = 0;

// This is matrix labelled as "B"
var HMMObservationProbabilityMatrix = function() {
  Matrix.apply(this, arguments);

  // This is "N"
  this.numberOfStates = this.rows;
  // This is "M"
  this.numberOfObservationSymbols = this.cols;
};

HMMObservationProbabilityMatrix.prototype = Object.create(StochasticMatrix);
HMMObservationProbabilityMatrix.prototype.numberOfStates = 0;
HMMObservationProbabilityMatrix.prototype.numberOfObservationSymbols = 0;

// This is the matrix labelled as "PI"
var HMMInitialStateDistributionMatrix = function() {
  Matrix.apply(this, arguments);

  if (this.rows !== 1) {
    throw new Error('HMMInitialStateDistributionMatrix: ' +
      'Must be a 1-row matrix.');
  }

  // This is "N"
  this.numberOfStates = this.cols;
};

HMMInitialStateDistributionMatrix.prototype = Object.create(StochasticMatrix);
HMMInitialStateDistributionMatrix.prototype.numberOfStates = 0;

module.exports.StochasticMatrix =
  StochasticMatrix;
module.exports.HMMStateTransitionMatrix =
  HMMStateTransitionMatrix;
module.exports.HMMObservationProbabilityMatrix =
  HMMObservationProbabilityMatrix;
module.exports.HMMInitialStateDistributionMatrix =
  HMMInitialStateDistributionMatrix;
