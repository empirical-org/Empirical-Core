import expect, {createSpy, spyOn, isSpy} from 'expect';
import {
  getCommonWords,
  getMissingWords,
  getMissingWordsFromResponses
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

describe("Finding the common words in multiple sentences", () => {
	const responses = [
    {
      text: "The woman in the next room is the teacher.",
      feedback: "Excellent, that's correct!",
      optimal: true,
      key: 1
    },
    {
      text: "The female teacher is in the next room.",
      feedback: "How do you refer to one specific teacher?",
      optimal: true,
      key: 2
    },
    {
      text: "The teacher is the woman in the next room.",
      feedback: "How do you refer to one specific teacher?",
      optimal: true,
      key: 3
    }
  ]
  const user = "The woman in the room is the teacher."

	it("returns the common missing words", () => {
		const expected = [
      "next"
    ]
		expect(getMissingWordsFromResponses(user, responses)).toEqual(expected);
	});
})
