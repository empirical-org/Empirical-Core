/*!
 * {LIB} v0.0.1
 * (c) 2017 {NAME}
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('underscore')) :
	typeof define === 'function' && define.amd ? define(['exports', 'underscore'], factory) :
	(factory((global.lib = global.lib || {}),global._));
}(this, (function (exports,_) { 'use strict';

_ = 'default' in _ ? _['default'] : _;

exports.Tagger = require('./POSTagger');
exports.Lexer = require('./lexer');

function wordLengthCount(str) {
  const strNoPunctuation = str.replace(/[^0-9a-z\s]/gi, '').split(/\s+/);
  return strNoPunctuation.length;
}

// start adding imports

exports.wordLengthCount = wordLengthCount;

Object.defineProperty(exports, '__esModule', { value: true });

})));
