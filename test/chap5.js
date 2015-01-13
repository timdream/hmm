'use strict';

var HiddenMarkovModel = require('../lib/hmm');

var HMMStateTransitionMatrix =
  require('../lib/hmm_matrices').HMMStateTransitionMatrix;
var HMMObservationProbabilityMatrix =
  require('../lib/hmm_matrices').HMMObservationProbabilityMatrix;
var HMMInitialStateDistributionMatrix =
  require('../lib/hmm_matrices').HMMInitialStateDistributionMatrix;

// (3)
var matrixA = new HMMStateTransitionMatrix([[0.7, 0.3],
                                            [0.4, 0.6]]);

// (4)
var matrixB = new HMMObservationProbabilityMatrix([[0.1, 0.4, 0.5],
                                                   [0.7, 0.2, 0.1]]);

// (5)
var matrixPI = new HMMInitialStateDistributionMatrix([[0.6, 0.4]]);

var hmm = new HiddenMarkovModel(matrixA, matrixB, matrixPI);

// (6)
var observations = [0, 1, 0, 2];

var seq = hmm.getMostProbableStateSequencesOfObservations(observations);

console.log(seq);
