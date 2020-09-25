import nlp from 'compromise';

import {countSentences} from './countSentences';

test('It can correctly count sentences', () => {
  const text = "The Williams' have been married for 40 years. They met at the park. The love running together";
  const doc = nlp(text, null);
  expect(doc.sentences().length).toBe(3);
})

test('It can correctly count sentences with abbreviations', () => {
  const text = "Dr. Williams and Mrs. Williams have been married for 40 years. Prof. Murray introduced them in Washington D.C.";
  const doc = nlp(text, null);
  expect(doc.sentences().length).toBe(2);
})

test('our sentence counting function', () => {
  const text = "The Williams' have been married for 40 years. They met at the park. The love running together";
  expect(countSentences(text)).toBe(3) 
  const text2 = "Dr. Williams and Mrs. Williams have been married for 40 years. Prof. Murray introduced them in Washington D.C.";
  expect(countSentences(text2)).toBe(2) 
})

test('error handling with our sentence counting function', () => {
  expect(countSentences(null)).toBe(0); 
  expect(countSentences("")).toBe(0); 
})