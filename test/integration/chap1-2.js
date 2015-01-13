'use strict';

var assert = require('chai').assert;
var HiddenMarkovModel = require('../../lib/hmm');

suite('Chapter 1: A simple example & Chapter 2: Notations', function() {
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

  test('(7)', function() {
    var hmm = new HiddenMarkovModel(a, b, pi);

    // (7)
    var seq = [0, 0, 1, 1];
    var p =
      hmm.getProbabilityOfStateSequenceForObservations(seq, observations);
    assert.equal(p.toFixed(6), '0.000212');
  });

  test('Table 1 and Table 2', function() {
    var hmm = new HiddenMarkovModel(a, b, pi);

    // Table 1
    var table1 = [];
    var pNums = [];
    var pSum = 0;

    var states = 1 << 4;
    for (var i = 0; i < states; i++) {
      var state = [
        (i & 0x8) >> 3,
        (i & 0x4) >> 2,
        (i & 0x2) >> 1,
        i & 0x1
      ];

      var p = hmm.getProbabilityOfStateSequenceForObservations(state, observations);
      pNums.push([p]);
      pSum += p;
      table1.push([state, p.toFixed(6)]);
    }

    // Add the nomralized probability column
    table1.forEach(function(row, i) {
      var np = row[1] / pSum;
      pNums[i].push(np);
      row.push(np.toFixed(6));
    });

    assert.deepEqual(table1,
      [ [ [ 0, 0, 0, 0 ], '0.000412', '0.042785' ],
        [ [ 0, 0, 0, 1 ], '0.000035', '0.003635' ],
        [ [ 0, 0, 1, 0 ], '0.000706', '0.073316' ],
        [ [ 0, 0, 1, 1 ], '0.000212', '0.022015' ],
        [ [ 0, 1, 0, 0 ], '0.000050', '0.005192' ],
        [ [ 0, 1, 0, 1 ], '0.000004', '0.000415' ],
        [ [ 0, 1, 1, 0 ], '0.000302', '0.031362' ],
        [ [ 0, 1, 1, 1 ], '0.000091', '0.009450' ],
        [ [ 1, 0, 0, 0 ], '0.001098', '0.114023' ],
        [ [ 1, 0, 0, 1 ], '0.000094', '0.009762' ],
        [ [ 1, 0, 1, 0 ], '0.001882', '0.195439' ],
        [ [ 1, 0, 1, 1 ], '0.000564', '0.058569' ],
        [ [ 1, 1, 0, 0 ], '0.000470', '0.048808' ],
        [ [ 1, 1, 0, 1 ], '0.000040', '0.004154' ],
        [ [ 1, 1, 1, 0 ], '0.002822', '0.293055' ],
        [ [ 1, 1, 1, 1 ], '0.000847', '0.087958' ] ]);

    // Table2
    var table2 = [[0, 0, 0, 0], [0, 0, 0, 0]];
    table1.forEach(function(row, rowNumber) {
      row[0].forEach(function(s, i) {
        table2[s][i] += pNums[rowNumber][1];
      });
    });
    table2.forEach(function(row) {
      row.forEach(function(n, i) {
        row[i] = n.toFixed(6);
      });
    });

    assert.deepEqual(table2,
      [ [ '0.188170', '0.519544', '0.228774', '0.803979' ],
        [ '0.811768', '0.480394', '0.771164', '0.195958' ] ]);
  });
});
