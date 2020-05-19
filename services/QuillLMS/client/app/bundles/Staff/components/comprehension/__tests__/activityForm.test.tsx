import * as React from 'react';
import { shallow } from 'enzyme';
import { DropdownInput, Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import ActivityForm from '../configureSettings/activityForm';
jest.mock('string-strip-html', () => ({
  default: jest.fn()
}))

const mockActivity = {
  title: 'Could Capybaras Create Chaos?',
  flag: 'beta',
  passages: ['...'],
  prompts: [{text: '1'}, {text: '2'}, {text: '3'}]
}
const mockProps = {
  activity: mockActivity,
  closeModal: jest.fn(),
  isNewActivity: true,
  submitActivity: jest.fn()
};

describe('Activities component', () => {
  const container = shallow(<ActivityForm {...mockProps} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a DropdownInput, Input, or TextEditor component for each field', () => {
    // Input: Title, But Stem, Because Stem, So Stem (4)
    // DropdownInput: Development Stage (1)
    // TextEditor: Passage (1)
    expect(container.find(Input).length).toEqual(4);
    expect(container.find(DropdownInput).length).toEqual(1);
    expect(container.find(TextEditor).length).toEqual(1);
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
