import { shallow } from 'enzyme';
import * as React from 'react';

import { DataTable } from '../../../../Shared';
import ActivityForm from '../configureSettings/activityForm';
import UpperFormSection from '../configureSettings/upperFormSection';
import { mockActivity } from '../__mocks__/data';

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
  it('should render a DataTable component', () => {
    container = shallow(<ActivityForm {...mockProps} />);
    expect(container.find(DataTable).length).toEqual(1);
  });
});
