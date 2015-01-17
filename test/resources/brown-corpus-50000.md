# Note on `brown-corpus-50000.data`

The file is generated with the following steps:

1. Download `Brown.tgz` from http://www.cs.toronto.edu/~gpenn/csc401/a1res.html
   as stated in the paper.
2. Name the following file as `process.js`, put it into the extracted directory,
   and execute it with `node`.
3. The resulting file `brown-corpus-50000.data` will be exactly of 50000 bytes,
   with each byte valued from 0 to 27,
   which can be read into the program directly as the observation array.

## `process.js`

```javascript
'use strict';

var fs = require('fs');

var filenames = (function() {
  var filenames = [];

  // A01 - A45 has over 508685 characters -- we only need the first 50k.
  for (var i = 1; i < 45; i++) {
    filenames.push('A' + (i < 10 ? '0' : '') + i.toString(10));
  }

  return filenames;
})();

var corpus = new Buffer(50000);
var i = 0;

filenames.forEach(function(filename) {
  var text = fs.readFileSync(filename, { encoding: 'utf-8'});

  text.split('\n').forEach(function(line) {
    line = line.substr(15).trim().toLowerCase();
    line.split('').forEach(function(chr) {
      var code = chr.charCodeAt(0) - 0x61; // a = U+0061
      if (chr === ' ') {
        corpus[i] = 26;
        i++;
      } else if (code < 26 && code >= 0) {
        corpus[i] = code;
        i++;
      }
    });

    corpus[i] = 26;
    i++;
  });
});

fs.writeFileSync('brown-corpus-50000.data', corpus);

console.log(i);
```
