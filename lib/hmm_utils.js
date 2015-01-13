'use strict';

var UintSizedArray = function UintSizedArray(maxValue, length) {
  if (maxValue < 0x100) {
    return new Uint8Array(length);
  } else if (maxValue < 0x10000) {
    return new Uint16Array(length);
  } else if (maxValue < 0x100000000) {
    return new Uint32Array(length);
  } else {
    throw new Error('UintSizedArray: ' +
      'Can\'t find the type array that could hold the maximum value.');
  }
};

module.exports.UintSizedArray = UintSizedArray;
