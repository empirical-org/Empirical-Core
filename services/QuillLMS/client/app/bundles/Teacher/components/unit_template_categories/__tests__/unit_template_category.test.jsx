/**
 * @jest-environment jsdom
*/

import { mount } from 'enzyme';
import * as React from 'react';

import UnitTemplateCategory from '../unit_template_category';

describe('UnitTemplateCategory component', () => {

  describe('UnitTemplateCategory container', () => {
    const container = mount(<UnitTemplateCategory unitTemplateCategory={{name: 'unit template category name', primary_color: 'red', secondary_color: 'white'}} />);
    it('should render a UnitTemplateCategory component', () => {
      expect(container).toMatchSnapshot()
    });
  });

});
