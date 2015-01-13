# A Hidden Markov Model exercise

[![NPM version](https://badge.fury.io/js/hmm.png)](http://badge.fury.io/js/hmm)
[![Build Status](https://secure.travis-ci.org/timdream/hmm.png?branch=master)](http://travis-ci.org/timdream/hmm)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A simple Hidden Markov Model implementation.

This repository is an attempt to create a usable [Hidden Markov Model](https://en.wikipedia.org/wiki/Hidden_Markov_model) library,
based on the paper *A Revealing Introduction to Hidden Markov Models* by Dr. Mark Stamp of San Jose State University.

The paper can be downloaded [here](http://www.cs.sjsu.edu/~stamp/RUA/HMM.pdf).

## Getting Started
Install the module with: `npm install hmm`

```javascript
var HiddenMarkovModel = require('hmm');
// create a hmm machine with these definitions
var hmm = new HiddenMarkovModel(aDef, bDef, piDef);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2015 Timothy Guan-tin Chien
Licensed under the MIT license.
