import { mount } from 'enzyme';
import * as React from 'react';

import AssignANewActivity from '../assign_a_new_activity';

describe('AssignANewActivity component', () => {

  describe('default', () => {
    const wrapper = mount(<AssignANewActivity />)
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render a diagnostic banner', () => {
      expect(wrapper.find('.diagnostic-banner').length).toBe(0)
    })
  })

  describe('when showDiagnosticBanner is true', () => {

    it('should render a diagnostic banner', () => {
      const wrapper = mount(<AssignANewActivity showDiagnosticBanner={true} />)
      expect(wrapper.find('.diagnostic-banner').length).toBe(1)

    });
  })

});
