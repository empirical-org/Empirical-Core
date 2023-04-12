import { shallow } from 'enzyme';
import React from 'react';

import Cues from '../../renderForQuestions/cues.jsx';
import { Question } from '../question';

// TODO: add more tests

describe('Question component', () => {

  const mockProps = {
    match: {
      params: {
        questionID: 'abc'
      }
    },
    questions: {
      hasreceiveddata: true,
      data: {
        abc: {
          value: 'test1'
        },
        def: {
          value: 'test2'
        },
        ghi: {
          value: 'test3'
        }
      },
      states: {
        abc: {
          value: 'test1'
        },
        def: {
          value: 'test2'
        },
        ghi: {
          value: 'test3'
        }
      }
    },
    massEdit: {
      numSelectedResponses: 3
    }
  }

  const component = shallow(<Question {...mockProps} />);

  it('passes the correct props to Cues component', () => {
    expect(component.find(Cues).props().displayArrowAndText).toEqual(true);
    expect(component.find(Cues).props().question).toEqual(mockProps.questions.data['abc']);
  });
});
