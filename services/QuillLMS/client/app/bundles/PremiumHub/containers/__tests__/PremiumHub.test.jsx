import { mount } from 'enzyme';
import React from 'react';

import { FULL } from '../../shared';
import PremiumHub from '../PremiumHub';

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
