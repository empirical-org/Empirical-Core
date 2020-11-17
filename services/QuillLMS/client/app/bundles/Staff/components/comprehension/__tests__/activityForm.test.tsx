import * as React from 'react';
import { shallow } from 'enzyme';

import ActivityForm from '../configureSettings/activityForm';
import { Input, TextEditor, } from '../../../../Shared/index'
jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

const csrfToken = 'mocked-csrf-token';
document.head.innerHTML = `<meta name="csrf-token" content="${csrfToken}">`;

const mockActivity = {
  title: 'Could Capybaras Create Chaos?',
  scored_level: '7',
  target_level: 7,
  parent_activity_id: '17',
  passages: [{text: '...'}],
  prompts: [
    { conjunction: 'because', text: '1', max_attempts: 5, max_attempts_feedback: 'WRONG!' },
    { conjunction: 'but', text: '2', max_attempts: 5, max_attempts_feedback: 'WRONG!' },
    { conjunction: 'so', text: '3', max_attempts: 5, max_attempts_feedback: 'WRONG!' }
  ]
}
const mockProps = {
  activity: mockActivity,
  closeModal: jest.fn(),
  submitActivity: jest.fn()
};

describe('Activity Form component', () => {
  const container = shallow(<ActivityForm {...mockProps} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a DropdownInput, Input, or TextEditor component for each field', () => {
    // Input: Title, Scored Reading Level, Target Reading Level, But Stem, Because Stem, So Stem (6)
    // TextEditor: Passage, Max Feedback (2)
    expect(container.find(Input).length).toEqual(7);
    expect(container.find(TextEditor).length).toEqual(2);
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
