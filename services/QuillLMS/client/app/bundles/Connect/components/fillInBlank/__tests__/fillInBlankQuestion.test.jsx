import { shallow } from 'enzyme';
import React from 'react';

import Cues from '../../renderForQuestions/cues.jsx';
import { FillInBlankQuestion } from '../fillInBlankQuestion';

// TODO: add more tests

describe('FillInBlankQuestion component', () => {

  const mockProps = {
    match: {
      params: {
        questionID: 'abc'
      }
    },
    fillInBlank: {
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

  const component = shallow(<FillInBlankQuestion {...mockProps} />);

  it('passes the correct props to Cues component', () => {
    expect(component.find(Cues).props().displayArrowAndText).toEqual(true);
    expect(component.find(Cues).props().question).toEqual(mockProps.fillInBlank.data['abc']);
  });
});
