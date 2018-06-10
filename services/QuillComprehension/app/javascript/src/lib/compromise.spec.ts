import nlp from 'compromise';

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