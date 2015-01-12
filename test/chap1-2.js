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

// (7)
var p =
  hmm.getProbabilityOfStateSequenceForObservations([0, 0, 1, 1], observations);
console.log(p.toFixed(6));

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

console.log(table1);

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
console.log(table2);
