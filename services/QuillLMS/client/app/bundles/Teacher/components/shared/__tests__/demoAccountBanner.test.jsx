import React from 'react';
import { mount } from 'enzyme';
import { DropdownInput } from '../../../../Shared/index'

import DemoAccountBanner from '../demoAccountBanner';

const sharedProps = {
  signedInOutsideDemo: true,
  recommendationsLink: '',
  growthSummaryLink: ''
}

describe('DemoAccountBanner component', () => {
  describe('not expanded', () => {
    const wrapper = mount(
      <DemoAccountBanner
        {...sharedProps}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

  })

  describe('expanded', () => {
    const wrapper = mount(
      <DemoAccountBanner
        {...sharedProps}
        defaultIsExpanded={true}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

  })

});
