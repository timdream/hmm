'use strict';

var HiddenMarkovModel = require('../lib/hmm');

// (3)
var a = [[0.7, 0.3],
         [0.4, 0.6]];

// (4)
var b = [[0.1, 0.4, 0.5],
         [0.7, 0.2, 0.1]];

// (5)
var pi = [[0.6, 0.4]];

var hmm = new HiddenMarkovModel(a, b, pi);

// (6)
var observations = [0, 1, 0, 2];

var seq = hmm.getMostProbableStateSequencesOfObservations(observations);

console.log(seq);
