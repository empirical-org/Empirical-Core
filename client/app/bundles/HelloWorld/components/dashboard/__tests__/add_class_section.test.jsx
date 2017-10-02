import React from 'react';
import { shallow } from 'enzyme';

import AddClassSection from '../add_class_section';

describe('AddClassSection component', () => {

  it('should render', () => {
    expect(shallow(<AddClassSection />)).toMatchSnapshot();
  });

});
