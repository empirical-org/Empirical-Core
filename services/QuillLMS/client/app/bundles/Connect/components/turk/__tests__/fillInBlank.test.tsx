import * as React from 'react';
import { shallow } from 'enzyme';

import { PlayFillInTheBlankQuestion } from '../fillInBlank';
import Cues from '../../renderForQuestions/cues.jsx';

// TODO: add more tests

describe('PlayFillInTheBlankQuestion component', () => {

  const mockProps = {
    question: {
      prompt: 'this is a ___ prompt'
    }
  }

  const component = shallow(<PlayFillInTheBlankQuestion {...mockProps} />);

  it('passes the correct props to Cues component', () => {
    expect(component.find(Cues).props().displayArrowAndText).toEqual(true);
    expect(component.find(Cues).props().question).toEqual(mockProps.question);
  });
});
