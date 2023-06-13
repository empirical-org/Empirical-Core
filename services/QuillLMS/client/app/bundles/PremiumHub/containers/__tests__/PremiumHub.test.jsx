import { mount } from 'enzyme';
import React from 'react';

import PremiumHub from '../PremiumHub';
import { FULL } from '../../shared'

const sharedProps = {
  passedModel: { teachers: [], schools: [], admin_approval_requests: [] },
  adminId: 7,
}

describe('PremiumHub container', () => {
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
