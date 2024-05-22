import { shallow } from 'enzyme';
import * as React from 'react';

import Cues from '../../renderForQuestions/cues.jsx';
import { PlayFillInTheBlankQuestion } from '../fillInBlank';

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
