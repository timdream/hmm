'use strict';

var UintSizedArray = function UintSizedArray(maxValue, length) {
  if (maxValue < 0x100) {
    return Uint8Array(length);
  } else if (maxValue < 0x10000) {
    return Uint16Array(length);
  } else if (maxValue < 0x100000000) {
    return Uint32Array(length);
  } else {
    throw new Error('UintSizedArray: ' +
      'Can\'t find the type array that could hold the maximum value.');
  }
};

module.exports.UintSizedArray = UintSizedArray;
