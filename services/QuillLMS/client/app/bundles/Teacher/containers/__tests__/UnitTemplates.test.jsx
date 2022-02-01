import React from 'react';
import { shallow } from 'enzyme';

import UnitTemplates from '../UnitTemplates.jsx';

describe('UnitTemplates container', () => {

  it('should match snapshot', () => {
    expect(shallow(<UnitTemplates />)).toMatchSnapshot();
  });

});
