import * as React from 'react';
import { render, } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { RegexInputAndConceptSelectorForm, FOCUS_POINT, INCORRECT_SEQUENCE } from '../regexInputAndConceptSelectorForm';

import * as shared from '../../../../Shared/index';

// this has to get mocked because otherwise its internal props change every time
jest.spyOn(shared, 'TextEditor').mockImplementation(() => {
  return jest.fn()
})

function mockConceptsReducer(initialState, action) {
  return {
    concepts: {
      data: {}
    }
  }
}

const store = createStore(mockConceptsReducer);

const mockProps = {
  item: {
    name: 'Test Item',
    text: 'sample text|||',
    feedback: 'sample feedback',
    conceptResults: { key1: { correct: true, name: 'Concept 1', conceptUID: 'c1' }, key2: { correct: false, name: 'Concept 2', conceptUID: 'c2' } },
    caseInsensitive: true,
  },
  itemLabel: 'Sample Label',
  questionID: 1,
  focusPointOrIncorrectSequence: FOCUS_POINT,
  usedSequences: ['seq1', 'seq2'],
  onSubmit: jest.fn(),
  questions: { data: { 1: 'Question 1 data' } },
  states: {},
  ResponseComponent: () => <div>Response Component</div>,
  fillInBlank: { data: { 1: 'Fill In Blank Data' } },
  sentenceFragments: { data: { 1: 'Sentence Fragments Data' } },
};

describe('RegexInputAndConceptSelectorForm', () => {
  it('renders correctly with given props', () => {
    const { asFragment } = render(<Provider store={store}><RegexInputAndConceptSelectorForm {...mockProps} /></Provider>);
    expect(asFragment()).toMatchSnapshot();
  });
})
