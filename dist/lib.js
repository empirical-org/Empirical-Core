/*!
 * {LIB} v0.0.4
 * (c) 2017 {NAME}
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.lib = global.lib || {})));
}(this, (function (exports) { 'use strict';

// declare function train(text: string): Dictionary;
function train(text) {
    console.log(typeof (text));
    if (typeof (text) !== 'string') {
        return {};
    }
    var dictionary = {};
    var word, m;
    var r = /[a-z]+/g;
    text = text.toLowerCase();
    while (m = r.exec(text)) {
        word = m[0];
        dictionary[word] = dictionary.hasOwnProperty(word) ? dictionary[word] + 1 : 1;
    }
    return dictionary;
}

var letters = "abcdefghijklmnopqrstuvwxyz".split("");

function edits(word) {
    var i, results = [];
    // deletion
    for (i = 0; i < word.length; i++)
        results.push(word.slice(0, i) + word.slice(i + 1));
    // transposition
    for (i = 0; i < word.length - 1; i++)
        results.push(word.slice(0, i) + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
    // alteration
    for (i = 0; i < word.length; i++)
        letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i + 1));
        });
    // insertion
    for (i = 0; i <= word.length; i++)
        letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i));
        });
    return results;
}

function max(candidates) {
    var candidate, arr = [];
    for (candidate in candidates)
        if (candidates.hasOwnProperty(candidate))
            arr.push(candidate);
    var output = Math.max.apply(null, arr);
    return output;
}

function countKeys(candidates) {
    return Object.keys(candidates).length;
}

function correct(dictionary, potentialWord) {
    if (dictionary.hasOwnProperty(potentialWord)) {
        return potentialWord;
    }
    var candidates = {};
    var list = edits(potentialWord);
    list.forEach(function (edit) {
        if (dictionary.hasOwnProperty(edit))
            candidates[dictionary[edit]] = edit;
    });
    if (countKeys(candidates) > 0)
        return candidates[max(candidates)];
    list.forEach(function (edit) {
        edits(edit).forEach(function (w) {
            if (dictionary.hasOwnProperty(w))
                candidates[dictionary[w]] = w;
        });
    });
    return countKeys(candidates) > 0 ? candidates[max(candidates)] : potentialWord;
}

exports.train = train;
exports.correct = correct;
exports.edits = edits;

Object.defineProperty(exports, '__esModule', { value: true });

})));
