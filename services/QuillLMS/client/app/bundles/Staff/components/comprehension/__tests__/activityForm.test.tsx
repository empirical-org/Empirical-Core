import * as React from 'react';
import { shallow } from 'enzyme';

import { mockActivity } from '../__mocks__/data';
import ActivityForm from '../configureSettings/activityForm';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

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
