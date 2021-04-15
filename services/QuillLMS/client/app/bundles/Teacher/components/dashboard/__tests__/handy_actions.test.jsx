import React from 'react';
import { mount } from 'enzyme';

import HandyActions from '../handy_actions';

describe('HandyActions component', () => {

  it('should render when the user is not linked to Clever', () => {
    const wrapper = mount(<HandyActions linkedToClever={false} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when the user is linked to Clever', () => {
    const wrapper = mount(<HandyActions linkedToClever={true} />);
    expect(wrapper).toMatchSnapshot()
  });

});
