import * as React from 'react';
import { shallow } from 'enzyme';
import * as _ from 'underscore'

import { AdminsTeachers } from '../adminsTeachers';

describe('AdminsTeachers component', () => {
  const mockProps = {
    data: [{ school: "Test School" }],
    refreshData: jest.fn
  }
  const component = shallow(<AdminsTeachers {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
