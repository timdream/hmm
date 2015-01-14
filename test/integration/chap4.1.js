'use strict';

var assert = require('chai').assert;
var HiddenMarkovModel = require('../../lib/hmm');

suite('Chapter 4.1 Solution to Problem 1', function() {
  var a, b, pi, observations;
  var expectedP;

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

    // This is the direct calculation above (8) on page 6 --
    // we will use this to verify our answer in (8) is correct.
    expectedP = 0;
    var hmm = new HiddenMarkovModel(a, b, pi);
    var numberOfPossibleStateSequences = 1 << 4;
    for (var i = 0; i < numberOfPossibleStateSequences; i++) {
      var state = [(i & 0x8) >> 3, (i & 0x4) >> 2, (i & 0x2) >> 1, i & 0x1];

      expectedP +=
        hmm.getProbabilityOfStateSequenceForObservations(state, observations);
    }
  });

  test('(8)', function() {
    var hmm = new HiddenMarkovModel(a, b, pi);
    var p = hmm.getProbabilityOfObservations(observations);

    // Ignore float point error by taking only the first 12 digits.
    assert.equal(p.toFixed(12), expectedP.toFixed(12));
  });
});
