import * as React from 'react';
import { shallow } from 'enzyme';
import { DropdownInput, Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import ActivityForm from '../activityForm';

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
    expect(container.find(DropdownInput).length).toEqual(1);
    expect(container.find(Input).length).toEqual(4);
    expect(container.find(TextEditor).length).toEqual(1);
  });
  it('clicking the "x" button or "close" button should call closeModal prop', () => {
    container.find('button').first().simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalled();
    container.find('button').last().simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalled();
  });
  it('clicking submit button should call submitActivity prop', () => {
    container.find('button').at(1).simulate('click');
    expect(mockProps.submitActivity).toHaveBeenCalled();
  });
});
