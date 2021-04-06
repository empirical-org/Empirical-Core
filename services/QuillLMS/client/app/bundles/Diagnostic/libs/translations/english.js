const buttonText = {
  'submit button text': 'Submit',
  'resume button text': 'Resume',
  'continue button text': 'Continue',
  'begin button text': 'Begin',
  'sentence fragment complete button': 'Complete',
  'sentence fragment incomplete button': 'Incomplete',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': "<h3>Fill in the Blank: A, An, The</h3><p>In this section, each sentence will have two or three blanks.</p><p>You'll fill in the blank with one of the words from a list, or you'll leave the blank empty if no word is needed.</p>",
  'titlecard-ell-fill-in-single-blank': "<h3>Fill in the Blank</h3><p>You're halfway there! In this section, you'll choose the best word to complete a sentence. You'll fill in the blank with one of the words from a list.</p>",
  'titlecard-ell-complete-sentences': "<h3>Complete Sentences</h3><p>In this section, you'll add to a group of words to make a complete sentence. Add as few words as possible.</p><p>Let's start!</p>",
  'titlecard-ell-past-present-and-future-tense': "<h3>Past, Present, and Future Tense </h3><p>In this section, you'll correct sentences by putting the verb in the right tense to match the rest of the sentence.</p><p>You're doing great so far!</p>",
  'titlecard-ell-sentence-combining': "<h3>Sentence Combining</h3><p>In this section, you'll combine sentences into one sentence.</p><p>Sometimes you'll be given joining words to choose from, and sometimes you'll have to choose your own way of combining the sentences.</p><p>Only add or change words when you need to, and try to keep the meaning of the sentences the same.</p><p>You've got this!</p>",
  'diagnostic intro text': "<h1>Quill Placement Activity</h1><p>You're about to answer 21 questions about writing sentences. Don't worry, it's not a test. It's just to figure out what you know.</p><p className='second-p'>Some of the questions might be about things you haven't learned yet &mdash; that's okay! Just answer them as best as you can. Once you're finished, Quill will create a learning plan just for you!</p>",
  'completion page': "<h1>You've completed the Quill Placement Activity</h1><p>Your results are being saved now. You'll be redirected automatically once they are saved.</p>",
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': 'Is this a complete or an incomplete sentence?',
  'sentence-fragment-complete-vs-incomplete-typing-choice-instructions': 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'Add to the group of words to make a complete sentence. Add as few words as possible.',
  'fill-in-the-blank-multiple-instructions': 'Fill in each blank with a word above. If no word is needed, leave the blank empty.',
  'tense-question-instructions': 'Rewrite the sentence. Correct the verb in bold so it is in the right tense to match the rest of the sentence.',
  'fill-in-the-blank-single-instructions': 'Fill in the blank with one of the words above.',
  'combine-sentences-instructions': 'Combine the sentences into one sentence.',
  'combine-sentences-with-joining-words-instructions': 'Combine the sentences. Use one of the joining words.',
};

const cues = {
  "choose one": "choose one / 1つ選ぶ",
  "choose three": "choose three / 3つ選ぶ",
  "choose two or three" : "choose two or three / 2つまたは3つ選ぶ",
  "joining word": "joining word / 単語の結合"
};

const scaffolds = {
  'joining word cues single': 'joining word',
  'joining word cues multiple': 'joining words',
  'add word bank cue': 'Add words',
};

const englishTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
  //...cues,
};

export default englishTranslation;
