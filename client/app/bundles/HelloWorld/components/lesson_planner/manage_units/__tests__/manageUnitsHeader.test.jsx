import React from 'react';
import { shallow } from 'enzyme';

import ManageUnitsHeader from '../manageUnitsHeader';

describe('ManageUnitsHeader component', () => {
  const wrapper = shallow(<ManageUnitsHeader />)

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
