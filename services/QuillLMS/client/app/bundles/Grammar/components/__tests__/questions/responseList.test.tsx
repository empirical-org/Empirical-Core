import React from 'react';
import { render } from '@testing-library/react';

import ResponseList from '../../questions/responseList';

describe('ResponseList', () => {
  let props;

  beforeEach(() => {
    props = {
      responses: [{ id: 1, key: '1', text: 'response text', statusCode: 2 }],
      massEdit: { selectedResponses: [] },
      dispatch: jest.fn(),
      selectedIncorrectSequences: ['sequence1'],
      selectedFocusPoints: ['focus1'],
      expanded: {},
      conceptID: 1,
      concepts: [],
      conceptsFeedback: [],
      expand: jest.fn(),
      getChildResponses: jest.fn(),
      getMatchingResponse: jest.fn(),
      getResponse: jest.fn(),
      mode: 'mode',
      question: 'question',
      questionID: 1,
      admin: false,
      states: {},
    };
  });

  it('should render', () => {
    expect(() => render(<ResponseList {...props} />) ).not.toThrow()
  });

  it('should render when props.states is undefined', () => {
    let specialProps = {...props, states: undefined }
    expect(() => render(<ResponseList {...specialProps} />) ).not.toThrow()
  });

});
