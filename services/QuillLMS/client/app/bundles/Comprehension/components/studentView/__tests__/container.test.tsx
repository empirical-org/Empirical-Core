import * as React from 'react';
import { shallow } from 'enzyme';

import { StudentViewContainer } from '../container';
import { PromptStep } from '../promptStep';

describe('StudentViewContainer Component', () => {
  const prompts = [
  {
    conjunction: "so",
    id: 21,
    max_attempts: 5,
    max_attempts_feedback: "<p>Nice effort! You made some good revisions.",
    text: "Plastic bag reduction laws are beneficial so"
  },
  {
    conjunction: "but",
    id: 20,
    max_attempts: 5,
    max_attempts_feedback: "<p>Nice effort! You made some good revisions.",
    text: "Plastic bag reduction laws are beneficial, but"
  },
  {
    conjunction: "because",
    id: 19,
    max_attempts: 5,
    max_attempts_feedback: "<p>Nice effort! You made some good revisions.",
    text: "Plastic bag reduction laws are beneficial because"
  }];
  const mockProps = {
    dispatch: jest.fn(),
    activities: {
      hasReceivedData: true,
      currentActivity: {
        id: 18,
        activity_id: 18,
        name: "Should Our Use of Plastic Bags be Regulated?",
        parent_activity_id: null,
        passages: [{
          id: 7,
          image_alt_text: "",
          image_link: null,
          text: "<p>How often do you use plastic bags?"
        }],
        prompts: [...prompts],
        scored_level: "",
        target_level: 4,
        title: "Should Our Use of Plastic Bags be Regulated?"
      }
    },
    session: {
      sessionID: 'test',
      submittedResponses: {
        19: null,
        20: null,
        21: null
      }
    },
    location: {
      search: null
    },
    handleFinishActivity: jest.fn(),
    isTurk: false
  }
  const component = shallow(<StudentViewContainer {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render prompts in correct order', () => {
    expect(component.find(PromptStep).at(0).props().prompt).toEqual(prompts[2])
    expect(component.find(PromptStep).at(1).props().prompt).toEqual(prompts[1])
    expect(component.find(PromptStep).at(2).props().prompt).toEqual(prompts[0])
  });
});
