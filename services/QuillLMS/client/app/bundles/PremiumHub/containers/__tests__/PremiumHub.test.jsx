import React from 'react';
import { mount } from 'enzyme';

import PremiumHub from '../PremiumHub';
import { FULL, LIMITED, RESTRICTED, } from '../../shared'

const sharedProps = {
  passedModel: { teachers: [], schools: [], admin_approval_requests: [] },
  adminId: 7,
}

describe('PremiumHub container', () => {
  process.env.PUSHER_KEY = 'pusher';

  it('should render with a full access type', () => {
    const wrapper = mount(<PremiumHub {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with a limited access type', () => {
    const wrapper = mount(<PremiumHub {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with a restricted access type', () => {
    const wrapper = mount(<PremiumHub {...sharedProps} accessType={FULL} />);
    expect(wrapper).toMatchSnapshot()
  })

});
