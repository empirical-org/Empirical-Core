import expect, {createSpy, spyOn, isSpy} from 'expect';
import {
  getCommonWords,
  getMissingWords
} from '../../app/libs/requiredWords'
import {
  getPartsOfSpeechWordsWithTags,
  checkPOSEquivalancy
} from '../../app/libs/partsOfSpeechTagging';



describe("Finding the common words in multiple sentences", () => {
	const sentences = [
    "Bob and Sally went to the park.",
    "Bob and Sally both went to the park."
  ];

	it("returns change objects", () => {
		const expected = [
      "Bob",
      "and",
      "Sally",
      "went",
      "to",
      "the",
      "park"
    ]
		expect(getCommonWords(sentences)).toEqual(expected);
	});
})

describe("Finding the common words in multiple sentences, taking capitalisation into account", () => {
	const sentences = [
    "Bob and Sally then went to the park.",
    "Then Bob and Sally went to the park."
  ];

	it("returns change objects", () => {
		const expected = [
      "Bob",
      "and",
      "Sally",
      "went",
      "to",
      "the",
      "park"
    ]
		expect(getCommonWords(sentences)).toEqual(expected);
	});
})

describe("Detecting if a string is missing a required word", () => {
	const sentences = [
    "Bob and Sally then went to the park.",
    "Then Bob and Sally went to the park."
  ];

	it("knows when a user hasn't missed any words", () => {
    const user = "Then Bob and Sally both went to the park."
		const expected = []
		expect(getMissingWords(user, sentences)).toEqual(expected);
	});

  it("knows when a user has missed a word", () => {
    const user = "Then Bob and Stephanie both went to the park."
		const expected = ["Sally"];
		expect(getMissingWords(user, sentences)).toEqual(expected);
	});

  it("knows when a user has missed multiple words", () => {
    const user = "Then they both went to the park."
		const expected = ["Bob", "and", "Sally"];
		expect(getMissingWords(user, sentences)).toEqual(expected);
	});
})
