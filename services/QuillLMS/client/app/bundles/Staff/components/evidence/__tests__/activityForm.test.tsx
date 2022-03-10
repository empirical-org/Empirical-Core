import * as React from 'react';
import { shallow } from 'enzyme';

import { mockActivity } from '../__mocks__/data';
import ActivityForm from '../configureSettings/activityForm';
import UpperFormSection from '../configureSettings/upperFormSection';
import { ToggleComponentSection } from '../../../../Shared';

const mockProps = {
  activity: mockActivity,
  handleClickArchiveActivity: jest.fn(),
  requestErrors: [],
  submitActivity: jest.fn()
};

describe('Activity Form component', () => {
  let container = shallow(<ActivityForm {...mockProps} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render an UpperFormSection component', () => {
    container = shallow(<ActivityForm {...mockProps} />);
    expect(container.find(UpperFormSection).length).toEqual(1);
  });
  it('should render 6 ToggleComponentSection components', () => {
    mockProps.requestErrors = ['passage.text: passage text is too short'];
    container = shallow(<ActivityForm {...mockProps} />);
    expect(container.find(ToggleComponentSection).length).toEqual(6);
  });
});
