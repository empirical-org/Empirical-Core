import * as React from 'react';
import { mount } from 'enzyme';

import { BUT, BECAUSE, SO }  from '../../../../../constants/comprehension';
import ActivityForm from '../configureSettings/activityForm';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

const FEEDBACK = 'At no point in your rambling, incoherent response were you even close to anything that could be considered a rational thought. I award you no points, and may God have mercy on your soul.'

const mockActivity = {
  title: 'Could Capybaras Create Chaos?',
  scored_level: '7',
  target_level: 7,
  parent_activity_id: '17',
  passages: [{text: '...'}],
  prompt_attributes: [
    {
      conjunction: BECAUSE,
      text: '1',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    },
    {
      conjunction: BUT,
      text: '2',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    },
    {
      conjunction: SO,
      text: '3',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    }
  ]
}
const mockProps = {
  activity: mockActivity,
  closeModal: jest.fn(),
  submitActivity: jest.fn()
};

describe('Activity Form component', () => {
  const container = mount(<ActivityForm {...mockProps} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
  it('clicking the "x" button or "close" button should call closeModal prop', () => {
    container.find('#activity-close-button').simulate('click');
    container.find('#activity-cancel-button').simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalledTimes(2);
  });
  it('clicking submit button should submit activity', () => {
    container.find('#activity-submit-button').simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalled();
  });
});
