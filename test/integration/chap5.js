'use strict';

var assert = require('chai').assert;

var HiddenMarkovModel = require('../../lib/hmm');

suite('Chapter 5: Dynamic programming', function() {
  var a, b, pi, observations;
  setup(function() {
    // (3)
    a = [[0.7, 0.3],
         [0.4, 0.6]];

    // (4)
    b = [[0.1, 0.4, 0.5],
         [0.7, 0.2, 0.1]];

    // (5)
    pi = [[0.6, 0.4]];

    // (6)
    observations = [0, 1, 0, 2];
  });

  test('Find the optimal path', function() {
    var hmm = new HiddenMarkovModel(a, b, pi);
    var seq = hmm.getMostProbableStateSequencesOfObservations(observations);

    assert.deepEqual(seq, [1, 1, 1, 0]);
  });
});
