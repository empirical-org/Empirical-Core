/*!
 * {LIB} v0.1.0
 * (c) 2018 {NAME}
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('quill-spellchecker'), require('underscore'), require('quill-string-normalizer'), require('diff')) :
	typeof define === 'function' && define.amd ? define(['exports', 'quill-spellchecker', 'underscore', 'quill-string-normalizer', 'diff'], factory) :
	(factory((global.lib = global.lib || {}),global.quillSpellchecker,global._,global.quillStringNormalizer,global.diff));
}(this, (function (exports,quillSpellchecker,_,quillStringNormalizer,diff) { 'use strict';

function getOptimalResponses(responses) {
    return _.where(responses, { optimal: true, });
}

function getTopOptimalResponse(responses) {
    return _.sortBy(getOptimalResponses(responses), function (r) { return r.count; }).reverse()[0];
}

function exactMatch(responseString, responses) {
    return _.find(responses, function (resp) { return quillStringNormalizer.stringNormalize(resp.text) === quillStringNormalizer.stringNormalize(responseString); });
}

function conceptResultTemplate(conceptUID, correct) {
    if (correct === void 0) { correct = false; }
    return {
        conceptUID: conceptUID,
        correct: correct,
    };
}

function focusPointMatch(responseString, focusPoints) {
    return _.find(focusPoints, function (fp) {
        var options = fp.text.split('|||');
        var anyMatches = _.any(options, function (opt) { return responseString.indexOf(opt) !== -1; });
        return !anyMatches;
    });
}
function focusPointChecker(responseString, focusPoints, responses) {
    var match = focusPointMatch(responseString, focusPoints);
    if (match) {
        return focusPointResponseBuilder(match, responses);
    }
}
function focusPointResponseBuilder(focusPointMatch, responses) {
    var res = {
        feedback: focusPointMatch.feedback,
        author: 'Focus Point Hint',
        parent_id: getTopOptimalResponse(responses).id
    };
    if (focusPointMatch.concept_uid) {
        res.concept_results = [
            conceptResultTemplate(focusPointMatch.concept_uid)
        ];
    }
    if (focusPointMatch.concept_results) {
        res.concept_results = focusPointMatch.concept_results;
    }
    return res;
}

function incorrectSequenceMatch(responseString, incorrectSequences) {
    return _.find(incorrectSequences, function (incSeq) {
        var options = incSeq.text.split('|||');
        var anyMatches = _.any(options, function (opt) { return new RegExp(opt).test(responseString); });
        return anyMatches;
    });
}
function incorrectSequenceChecker(responseString, incorrectSequences, responses) {
    var match = incorrectSequenceMatch(responseString, incorrectSequences);
    if (match) {
        return incorrectSequenceResponseBuilder(match, responses);
    }
}
function incorrectSequenceResponseBuilder(incorrectSequenceMatch, responses) {
    var res = {
        feedback: incorrectSequenceMatch.feedback,
        author: 'Incorrect Sequence Hint',
        parent_id: getTopOptimalResponse(responses).id
    };
    if (incorrectSequenceMatch.concept_results) {
        res.concept_results = incorrectSequenceMatch.concept_results;
    }
    return res;
}

var feedback_strings = {
    punctuationError: 'There may be an error. How could you update the punctuation?',
    punctuationAndCaseError: 'There may be an error. How could you update the punctuation and capitalization?',
    typingError: 'Try again. There may be a spelling mistake.',
    caseError: 'Proofread your work. There may be a capitalization error.',
    minLengthError: 'Revise your work. Do you have all of the information from the prompt?',
    maxLengthError: 'Revise your work. How could this sentence be shorter and more concise?',
    modifiedWordError: 'Revise your work. You may have mixed up or misspelled a word.',
    additionalWordError: 'Revise your work. You may have added an extra word.',
    missingWordError: 'Revise your work. You may have left out an important word.',
    whitespaceError: 'There may be an error. You may have forgotten a space between two words.',
    flexibleModifiedWordError: 'Revise your work. You may have mixed up a word.',
    flexibleAdditionalWordError: 'Revise your work. You may have added an extra word.',
    flexibleMissingWordError: 'Revise your work. You may have left out an important word.',
    spacingAfterCommaError: '<p>Revise your work. Always put a space after a <em>comma</em>.</p>'
};

function caseInsensitiveMatch(response, responses) {
    return _.find(getOptimalResponses(responses), function (resp) { return quillStringNormalizer.stringNormalize(resp.text).toLowerCase() === quillStringNormalizer.stringNormalize(response).toLowerCase(); });
}
function caseInsensitiveChecker(responseString, responses) {
    var match = caseInsensitiveMatch(responseString, responses);
    if (match) {
        var parentID = match.id;
        return caseInsensitiveResponseBuilder(responses, parentID);
    }
}
function caseInsensitiveResponseBuilder(responses, parentID) {
    var res = {
        feedback: feedback_strings.caseError,
        author: 'Capitalization Hint',
        parent_id: parentID,
        concept_results: [
            conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ')
        ]
    };
    return res;
}

function removePunctuation(string) {
    return string.replace(/[^A-Za-z0-9\s]/g, '');
}

function punctuationInsensitiveMatch(responseString, responses) {
    return _.find(getOptimalResponses(responses), function (resp) { return removePunctuation(quillStringNormalizer.stringNormalize(resp.text)) === removePunctuation(quillStringNormalizer.stringNormalize(responseString)); });
}
function punctuationInsensitiveChecker(responseString, responses) {
    var match = punctuationInsensitiveMatch(responseString, responses);
    if (match) {
        var parentID = match.id;
        return punctuationInsensitiveResponseBuilder(responses, parentID);
    }
}
function punctuationInsensitiveResponseBuilder(responses, parentID) {
    var res = {
        feedback: feedback_strings.punctuationError,
        author: 'Punctuation Hint',
        parent_id: parentID,
        concept_results: [
            conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
        ]
    };
    return res;
}

function punctuationAndCaseInsensitiveMatch(responseString, responses) {
    return _.find(getOptimalResponses(responses), function (resp) {
        var supplied = removePunctuation$1(quillStringNormalizer.stringNormalize(responseString)).toLowerCase();
        var target = removePunctuation$1(quillStringNormalizer.stringNormalize(resp.text)).toLowerCase();
        return supplied === target;
    });
}
function removePunctuation$1(string) {
    return string.replace(/[^A-Za-z0-9\s]/g, '');
}
function punctuationAndCaseInsensitiveChecker(responseString, responses) {
    var match = punctuationAndCaseInsensitiveMatch(responseString, responses);
    if (match) {
        var parentID = match.id;
        return punctuationAndCaseInsensitiveResponseBuilder(responses, parentID);
    }
}
function punctuationAndCaseInsensitiveResponseBuilder(responses, parentID) {
    var res = {
        feedback: feedback_strings.punctuationAndCaseError,
        author: 'Punctuation and Case Hint',
        parent_id: parentID,
        concept_results: [
            conceptResultTemplate('66upe3S5uvqxuHoHOt4PcQ'),
            conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
        ]
    };
    return res;
}

var subStrings = [
    ' ,',
    ' .',
    ' ;',
    ' !',
    ' ?'
];
var subStringsToText = {
    ' ,': 'comma',
    ' .': 'period',
    ' ;': 'semi-colon',
    ' !': 'exclamation mark',
    ' ?': 'question mark',
};
function getFeedbackForPunc(punc) {
    var fb = subStringsToText[punc];
    return "<p>Revise your sentence. You don't need to have a space before a <em>" + fb + "</em>.</p>";
}
function checkForSpacingError(userString) {
    return _.find(subStrings, function (subString) { return userString.indexOf(subString) !== -1; });
}
function spacingBeforePunctuation(userString) {
    var match = checkForSpacingError(userString);
    return (match ? { feedback: getFeedbackForPunc(match), } : undefined);
}

function spacingBeforePunctuationMatch(responseString) {
    return spacingBeforePunctuation(responseString);
}
function spacingBeforePunctuationChecker(responseString, responses) {
    var match = spacingBeforePunctuationMatch(responseString);
    if (match) {
        var feedback = match.feedback;
        return spacingBeforePunctuationResponseBuilder(responses, feedback);
    }
}
function spacingBeforePunctuationResponseBuilder(responses, feedback) {
    var res = {
        feedback: feedback,
        author: 'Punctuation Hint',
        parent_id: getTopOptimalResponse(responses) ? getTopOptimalResponse(responses).id : undefined,
        concept_results: [
            conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
        ]
    };
    return res;
}

function spacingAfterCommaMatch(response) {
    for (var i = 0; i < response.length; i++) {
        if (response[i] === ',' && (i + 1 < response.length)) {
            if (response[i + 1] !== ' ') {
                return true;
            }
            
        }
    }
    return false;
}
function spacingAfterCommaChecker(responseString, responses) {
    var match = spacingAfterCommaMatch(responseString);
    if (match) {
        return spacingAfterCommaResponseBuilder(responses);
    }
}
function spacingAfterCommaResponseBuilder(responses) {
    var res = {
        feedback: feedback_strings.spacingAfterCommaError,
        author: 'Punctuation Hint',
        parent_id: getTopOptimalResponse(responses) ? getTopOptimalResponse(responses).id : undefined,
        concept_results: [
            conceptResultTemplate('mdFUuuNR7N352bbMw4Mj9Q')
        ]
    };
    return res;
}

function whitespaceMatch(response, responses) {
    return _.find(getOptimalResponses(responses), function (resp) { return removeSpaces(quillStringNormalizer.stringNormalize(response)) === removeSpaces(quillStringNormalizer.stringNormalize(resp.text)); });
}
var removeSpaces = function (string) { return string.replace(/\s+/g, ''); };
function whitespaceChecker(responseString, responses) {
    var match = whitespaceMatch(responseString, responses);
    if (match) {
        var parent_id = match.id;
        return whitespaceResponseBuilder(responses, parent_id);
    }
}
function whitespaceResponseBuilder(responses, parent_id) {
    var res = {
        feedback: feedback_strings.whitespaceError,
        author: 'Whitespace Hint',
        parent_id: parent_id,
        concept_results: [
            conceptResultTemplate('5Yv4-kNHwwCO2p8HI90oqQ')
        ]
    };
    return res;
}

var constants = {
    timing: 'Revise your work. Which joining word helps show the timing of the events?',
    opposite: 'Revise your work. Which joining word helps show that the two ideas are opposite?',
    reason: 'Revise your work. Which joining word helps tell why or give a reason?',
    prerequisite: 'Revise your work. Which joining word helps show that one of the ideas must happen for the other one to happen?',
    choice: 'Revise your work. Which joining word is used to show a choice?',
    and: 'Revise your work. Which joining word is used to add another idea?',
};
var data = {
    after: {
        feedback: constants.timing,
    },
    'as soon as': {
        feedback: constants.timing,
    },
    before: {
        feedback: constants.timing,
    },
    whenever: {
        feedback: constants.timing,
    },
    while: {
        feedback: constants.timing,
    },
    once: {
        feedback: constants.timing,
    },
    when: {
        feedback: constants.timing,
    },
    until: {
        feedback: constants.timing,
    },
    although: {
        feedback: constants.opposite,
    },
    'even though': {
        feedback: constants.opposite,
    },
    though: {
        feedback: constants.opposite,
    },
    but: {
        feedback: constants.opposite,
    },
    yet: {
        feedback: constants.opposite,
    },
    since: {
        feedback: constants.reason,
    },
    so: {
        feedback: constants.reason,
    },
    because: {
        feedback: constants.reason,
    },
    for: {
        feedback: constants.reason,
    },
    as: {
        feedback: constants.reason,
    },
    'as long as': {
        feedback: constants.prerequisite,
    },
    if: {
        feedback: constants.prerequisite,
    },
    unless: {
        feedback: constants.prerequisite,
    },
    'in order to': {
        feedback: constants.prerequisite,
    },
    or: {
        feedback: constants.choice,
    },
    nor: {
        feedback: constants.choice,
    },
    and: {
        feedback: constants.and,
    },
};
function getFeedbackForMissingWord(missingWord) {
    if (missingWord) {
        var hit = data[cleanMissingWord(missingWord)];
        if (hit) {
            return hit.feedback;
        }
    }
}

function cleanMissingWord(missingWord) {
    return missingWord.trim().toLowerCase();
}

function rigidChangeObjectChecker(responseString, responses) {
    var match = rigidChangeObjectMatch(responseString, responses);
    if (match) {
        return rigidChangeObjectMatchResponseBuilder(match);
    }
}
function flexibleChangeObjectChecker(responseString, responses) {
    var match = flexibleChangeObjectMatch(responseString, responses);
    if (match) {
        return flexibleChangeObjectMatchResponseBuilder(match);
    }
}
function rigidChangeObjectMatchResponseBuilder(match) {
    var res = {};
    switch (match.errorType) {
        case ERROR_TYPES.INCORRECT_WORD:
            var missingWord = match.missingText;
            var missingTextFeedback = getFeedbackForMissingWord(missingWord);
            res.feedback = missingTextFeedback || feedback_strings.modifiedWordError;
            res.author = 'Modified Word Hint';
            res.parent_id = match.response.key;
            res.concept_results = [
                conceptResultTemplate('H-2lrblngQAQ8_s-ctye4g')
            ];
            return res;
        case ERROR_TYPES.ADDITIONAL_WORD:
            res.feedback = feedback_strings.additionalWordError;
            res.author = 'Additional Word Hint';
            res.parent_id = match.response.key;
            res.concept_results = [
                conceptResultTemplate('QYHg1tpDghy5AHWpsIodAg')
            ];
            return res;
        case ERROR_TYPES.MISSING_WORD:
            res.feedback = feedback_strings.missingWordError;
            res.author = 'Missing Word Hint';
            res.parent_id = match.response.key;
            res.concept_results = [
                conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
            ];
            return res;
        default:
            return;
    }
}
function flexibleChangeObjectMatchResponseBuilder(match) {
    var initialVals = rigidChangeObjectMatchResponseBuilder(match);
    initialVals.author = "Flexible " + initialVals.author;
    return initialVals;
}
function rigidChangeObjectMatch(response, responses) {
    var fn = function (string) { return quillStringNormalizer.stringNormalize(string); };
    return checkChangeObjectMatch(response, getOptimalResponses(responses), fn);
}
function flexibleChangeObjectMatch(response, responses) {
    var fn = function (string) { return removePunctuation(quillStringNormalizer.stringNormalize(string)).toLowerCase(); };
    return checkChangeObjectMatch(response, getOptimalResponses(responses), fn);
}
function checkChangeObjectMatch(userString, responses, stringManipulationFn, skipSort) {
    if (skipSort === void 0) { skipSort = false; }
    if (!skipSort) {
        responses = _.sortBy(responses, 'count').reverse();
    }
    var matchedErrorType;
    var matched = _.find(responses, function (response) {
        matchedErrorType = getErrorType(stringManipulationFn(response.text), stringManipulationFn(userString));
        return matchedErrorType;
    });
    if (matched) {
        var textChanges = getMissingAndAddedString(matched.text, userString);
        return Object.assign({}, {
            response: matched,
            errorType: matchedErrorType,
        }, textChanges);
    }
}
var ERROR_TYPES = {
    NO_ERROR: 'NO_ERROR',
    MISSING_WORD: 'MISSING_WORD',
    ADDITIONAL_WORD: 'ADDITIONAL_WORD',
    INCORRECT_WORD: 'INCORRECT_WORD',
};
var getErrorType = function (targetString, userString) {
    var changeObjects = getChangeObjects(targetString, userString);
    var hasIncorrect = checkForIncorrect(changeObjects);
    var hasAdditions = checkForAdditions(changeObjects);
    var hasDeletions = checkForDeletions(changeObjects);
    if (hasIncorrect) {
        return ERROR_TYPES.INCORRECT_WORD;
    }
    else if (hasAdditions) {
        return ERROR_TYPES.ADDITIONAL_WORD;
    }
    else if (hasDeletions) {
        return ERROR_TYPES.MISSING_WORD;
    }
};
var getMissingAndAddedString = function (targetString, userString) {
    var changeObjects = getChangeObjects(targetString, userString);
    var missingObject = _.where(changeObjects, { removed: true, })[0];
    var missingText = missingObject ? missingObject.value : undefined;
    var extraneousObject = _.where(changeObjects, { added: true, })[0];
    var extraneousText = extraneousObject ? extraneousObject.value : undefined;
    return {
        missingText: missingText,
        extraneousText: extraneousText,
    };
};
var getChangeObjects = function (targetString, userString) { return diff.diffWords(targetString, userString); };
var checkForIncorrect = function (changeObjects) {
    var tooLongError = false;
    var found = false;
    var foundCount = 0;
    var coCount = 0;
    changeObjects.forEach(function (current, index, array) {
        if (checkForAddedOrRemoved(current)) {
            coCount += 1;
        }
        tooLongError = checkForTooLongError(current);
        if (current.removed && getLengthOfChangeObject(current) < 2 && index === array.length - 1) {
            foundCount += 1;
        }
        else {
            foundCount += current.removed && getLengthOfChangeObject(current) < 2 && array[index + 1].added ? 1 : 0;
        }
    });
    return !tooLongError && (foundCount === 1) && (coCount === 2);
};
var checkForAdditions = function (changeObjects) {
    var tooLongError = false;
    var found = false;
    var foundCount = 0;
    var coCount = 0;
    changeObjects.forEach(function (current, index, array) {
        if (checkForAddedOrRemoved(current)) {
            coCount += 1;
        }
        tooLongError = checkForTooLongError(current);
        if (current.added && getLengthOfChangeObject(current) < 2 && index === 0) {
            foundCount += 1;
        }
        else {
            foundCount += current.added && getLengthOfChangeObject(current) < 2 && !array[index - 1].removed ? 1 : 0;
        }
    });
    return !tooLongError && (foundCount === 1) && (coCount === 1);
};
var checkForDeletions = function (changeObjects) {
    var tooLongError = false;
    var found = false;
    var foundCount = 0;
    var coCount = 0;
    changeObjects.forEach(function (current, index, array) {
        if (checkForAddedOrRemoved(current)) {
            coCount += 1;
        }
        tooLongError = checkForTooLongError(current);
        if (current.removed && getLengthOfChangeObject(current) < 2 && index === array.length - 1) {
            foundCount += 1;
        }
        else {
            foundCount += current.removed && getLengthOfChangeObject(current) < 2 && !array[index + 1].added ? 1 : 0;
        }
    });
    return !tooLongError && (foundCount === 1) && (coCount === 1);
};
var checkForAddedOrRemoved = function (changeObject) { return changeObject.removed || changeObject.added; };
var checkForTooLongChangeObjects = function (changeObject) { return getLengthOfChangeObject(changeObject) >= 2; };
var checkForTooLongError = function (changeObject) { return (changeObject.removed || changeObject.added) && checkForTooLongChangeObjects(changeObject); };
var getLengthOfChangeObject = function (changeObject) {
    // filter boolean removes empty strings from trailing,
    // leading, or double white space.
    return changeObject.value.split(' ').filter(Boolean).length;
};

exports.Tagger = require('./POSTagger');
exports.Lexer = require('./lexer');

function getPartsOfSpeech(input) {
    try {
        var words = new undefined().lex(input);
        var tagger = new undefined();
        return tagger.tag(words);
    }
    catch (e) {
        return undefined;
    }
}


function getPartsOfSpeechWordsWithTags(input) {
    var wordsTags = getPartsOfSpeech(input);
    if (wordsTags) {
        return wordsTags.map(function (b) {
            return [b[0], b[1]];
        });
    }
}

var posTranslations = {
    JJ: 'Adjective',
    JJR: 'Adjective',
    JJS: 'Adjective',
    RB: 'Adverb',
    RBR: 'Adverb',
    RBS: 'Adverb',
    WRB: 'Adverb',
    CC: 'Conjunction',
    NN: 'Noun',
    NNP: 'Noun',
    NNPS: 'Noun',
    NNS: 'Noun',
    CD: 'Number',
    LS: 'Number',
    IN: 'Preposition',
    PP$: 'Pronoun',
    PRP: 'Pronoun',
    WP: 'Pronoun',
    WP$: 'Pronoun',
    VB: 'Verb',
    VBD: 'Verb',
    VBG: 'Verb',
    VBN: 'Verb',
    VBP: 'Verb',
    VBZ: 'Verb',
};
function getCommonWords(sentences) {
    var words = _.map(sentences, function (sentence) { return normalizeString(sentence).split(' '); });
    return _.intersection.apply(_, words);
}
function getCommonWordsWithImportantPOS(sentences) {
    var allCommonWords = getCommonWords(sentences);
    return _.reject(allCommonWords, function (word) {
        if (getPartsOfSpeechWordsWithTags(word)[0]) {
            var tag = getPartsOfSpeechWordsWithTags(word)[0][1];
            return !posTranslations[tag];
        }
        else {
            return true;
        }
    });
}
function getMissingWords(userString, sentences) {
    var commonWords = getCommonWordsWithImportantPOS(sentences);
    var wordsFromUser = normalizeString(userString).split(' ');
    return _.reject(commonWords, function (commonWord) { return _.contains(wordsFromUser, commonWord); });
}

function _getCaseSensitiveWord(word, optimalSentence) {
    var normalizedString = removePunctuation$2(optimalSentence);
    var normalizedStringPlusLower = normalizeString(optimalSentence);
    var startIndex = normalizedStringPlusLower.indexOf(word);
    return normalizedString.substring(startIndex, word.length + startIndex);
}
function getFeedbackForWord(word, sentences, isSentenceFragment) {
    // const tag = getPOSForWord(word).toLowerCase();
    if (isSentenceFragment) {
        return "<p>Revise your work. Use all the words from the prompt, and make it complete by adding to it.</p>";
    }
    var caseSensitiveWord = _getCaseSensitiveWord(word, sentences[0]);
    return "<p>Revise your sentence to include the word <em>" + caseSensitiveWord + "</em>. You may have misspelled it.</p>";
}
function extractSentencesFromResponses(responses) {
    return responses.map(function (response) { return response.text; });
}
function getMissingWordsFromResponses(userString, sentences) {
    var missingWords = getMissingWords(userString, sentences);
    return _.sortBy(missingWords, function (word) { return word.length; }).reverse();
}
function checkForMissingWords(userString, responses, isSentenceFragment) {
    if (isSentenceFragment === void 0) { isSentenceFragment = false; }
    var sentences = extractSentencesFromResponses(responses);
    var missingWords = getMissingWordsFromResponses(userString, sentences);
    if (missingWords.length > 0) {
        return { feedback: getFeedbackForWord(missingWords[0], sentences, isSentenceFragment), };
    }
}
function normalizeString(string) {
    if (string === void 0) { string = ''; }
    return string.replace(/[.,?!;]/g, '').toLowerCase();
}
function removePunctuation$2(string) {
    if (string === void 0) { string = ''; }
    return string.replace(/[.,?!;]/g, '');
}

function requiredWordsMatch(responseString, responses) {
    return checkForMissingWords(responseString, getOptimalResponses(responses));
}
function requiredWordsChecker(responseString, responses) {
    var match = requiredWordsMatch(responseString, responses);
    if (match) {
        var feedback = match.feedback;
        return requiredWordsResponseBuilder(responses, feedback);
    }
}
function requiredWordsResponseBuilder(responses, feedback) {
    var res = {
        feedback: feedback,
        author: 'Required Words Hint',
        parent_id: getTopOptimalResponse(responses).id,
        concept_results: [
            conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
        ]
    };
    return res;
}

function minLengthMatch(responseString, responses) {
    var optimalResponses = getOptimalResponses(responses);
    if (optimalResponses.length < 2) {
        return undefined;
    }
    var lengthsOfResponses = optimalResponses.map(function (resp) { return quillStringNormalizer.stringNormalize(resp.text).split(' ').length; });
    var minLength = _.min(lengthsOfResponses) - 1;
    return responseString.split(' ').length < minLength;
}
function minLengthChecker(responseString, responses) {
    var match = minLengthMatch(responseString, responses);
    if (match) {
        return minLengthResponseBuilder(responses);
    }
}
function minLengthResponseBuilder(responses) {
    var optimalResponses = getOptimalResponses(responses);
    var shortestOptimalResponse = _.sortBy(optimalResponses, function (resp) { return quillStringNormalizer.stringNormalize(resp.text).length; })[0];
    var res = {
        feedback: feedback_strings.minLengthError,
        author: 'Missing Details Hint',
        parent_id: shortestOptimalResponse.key,
        concept_results: [
            conceptResultTemplate('N5VXCdTAs91gP46gATuvPQ')
        ]
    };
    return res;
}

function maxLengthMatch(responseString, responses) {
    var optimalResponses = getOptimalResponses(responses);
    if (optimalResponses.length < 2) {
        return false;
    }
    var lengthsOfResponses = optimalResponses.map(function (resp) { return quillStringNormalizer.stringNormalize(resp.text).split(' ').length; });
    var maxLength = _.max(lengthsOfResponses) + 1;
    return responseString.split(' ').length > maxLength;
}
function maxLengthChecker(responseString, responses) {
    var match = maxLengthMatch(responseString, responses);
    if (match) {
        return maxLengthResponseBuilder(responses);
    }
}
function maxLengthResponseBuilder(responses) {
    var optimalResponses = getOptimalResponses(responses);
    var longestOptimalResponse = _.sortBy(optimalResponses, function (resp) { return quillStringNormalizer.stringNormalize(resp.text).length; }).reverse()[0];
    var res = {
        feedback: feedback_strings.maxLengthError,
        author: 'Not Concise Hint',
        parent_id: longestOptimalResponse.key,
        concept_results: [
            conceptResultTemplate('QYHg1tpDghy5AHWpsIodAg')
        ]
    };
    return res;
}

function caseStartMatch(responseString, responses) {
    return (/^[a-z]/).test(responseString);
}
function caseStartChecker(responseString, responses) {
    var match = caseStartMatch(responseString, responses);
    if (match) {
        return caseStartResponseBuilder(responses);
    }
}
function caseStartResponseBuilder(responses) {
    var res = {
        feedback: feedback_strings.caseError,
        author: 'Capitalization Hint',
        parent_id: getTopOptimalResponse(responses).id,
        concept_results: [
            conceptResultTemplate('S76ceOpAWR-5m-k47nu6KQ')
        ],
    };
    return res;
}

function punctuationEndMatch(responseString, responses) {
    var lastChar = responseString[responseString.length - 1];
    return !!(lastChar && lastChar.match(/[a-z]/i));
}
function punctuationEndChecker(responseString, responses) {
    var match = punctuationEndMatch(responseString, responses);
    if (match) {
        return punctuationEndResponseBuilder(responses);
    }
}
function punctuationEndResponseBuilder(responses) {
    var res = {
        feedback: feedback_strings.punctuationError,
        author: 'Punctuation End Hint',
        parent_id: getTopOptimalResponse(responses).id,
        concept_results: [
            conceptResultTemplate('JVJhNIHGZLbHF6LYw605XA')
        ],
    };
    return res;
}

function checkSentenceCombining(question_uid, response, responses, focusPoints, incorrectSequences) {
    var responseTemplate = {
        text: response,
        question_uid: question_uid,
        count: 1
    };
    var data = {
        response: response,
        responses: responses,
        focusPoints: focusPoints,
        incorrectSequences: incorrectSequences,
    };
    var firstPass = checkForMatches(data, firstPassMatchers);
    if (firstPass) {
        return Object.assign(responseTemplate, firstPass);
    }
    // Correct the spelling and try again.
    var spellCheckedData = prepareSpellingData(data);
    var spellingPass = checkForMatches(spellCheckedData, firstPassMatchers);
    if (spellingPass) {
        // Update the indicate spelling is also needed.
        return Object.assign(responseTemplate, spellingPass);
    }
    var secondPass = checkForMatches(data, secondPassMatchers);
    if (secondPass) {
        return Object.assign(responseTemplate, secondPass);
    }
}
function firstPassMatchers(data) {
    var response, responses, focusPoints, incorrectSequences;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = data.response, responses = data.responses, focusPoints = data.focusPoints, incorrectSequences = data.incorrectSequences;
                return [4 /*yield*/, exactMatch(response, responses)];
            case 1:
                _a.sent();
                return [4 /*yield*/, focusPointChecker(response, focusPoints, responses)];
            case 2:
                _a.sent();
                return [4 /*yield*/, incorrectSequenceChecker(response, incorrectSequences, responses)];
            case 3:
                _a.sent();
                return [4 /*yield*/, caseInsensitiveChecker(response, responses)];
            case 4:
                _a.sent();
                return [4 /*yield*/, punctuationInsensitiveChecker(response, responses)];
            case 5:
                _a.sent();
                return [4 /*yield*/, punctuationAndCaseInsensitiveChecker(response, responses)];
            case 6:
                _a.sent();
                return [4 /*yield*/, spacingBeforePunctuationChecker(response, responses)];
            case 7:
                _a.sent();
                return [4 /*yield*/, spacingAfterCommaChecker(response, responses)];
            case 8:
                _a.sent();
                return [4 /*yield*/, whitespaceChecker(response, responses)];
            case 9:
                _a.sent();
                return [4 /*yield*/, rigidChangeObjectChecker(response, responses)];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function secondPassMatchers(data) {
    var response, responses, focusPoints, incorrectSequences;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = data.response, responses = data.responses, focusPoints = data.focusPoints, incorrectSequences = data.incorrectSequences;
                return [4 /*yield*/, flexibleChangeObjectChecker(response, responses)];
            case 1:
                _a.sent();
                return [4 /*yield*/, requiredWordsChecker(response, responses)];
            case 2:
                _a.sent();
                return [4 /*yield*/, minLengthChecker(response, responses)];
            case 3:
                _a.sent();
                return [4 /*yield*/, maxLengthChecker(response, responses)];
            case 4:
                _a.sent();
                return [4 /*yield*/, caseStartChecker(response, responses)];
            case 5:
                _a.sent();
                return [4 /*yield*/, punctuationEndChecker(response, responses)];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
function checkForMatches(data, matchingFunction) {
    var gen = matchingFunction(data);
    var next = gen.next();
    while (true) {
        if (next.value || next.done) {
            break;
        }
        next = gen.next();
    }
    if (next.value) {
        return next.value;
    }
}
function prepareSpellingData(data) {
    var spellingData = Object.assign({}, data);
    var optimalAnswerStrings = getOptimalResponses(data.responses).map(function (resp) { return resp.text; });
    spellingData.response = quillSpellchecker.correctSentenceFromSamples(optimalAnswerStrings, data.response, false);
    console.log("Corrected: ", spellingData.response);
    return spellingData;
}

// start adding imports

exports.checkSentenceCombining = checkSentenceCombining;

Object.defineProperty(exports, '__esModule', { value: true });

})));
