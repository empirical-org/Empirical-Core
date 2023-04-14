import { shallow } from 'enzyme';
import * as React from 'react';

import UnitTemplates from '../../UnitTemplates';

describe('UnitTemplates container', () => {

  it('should match snapshot', () => {
    expect(shallow(<UnitTemplates />)).toMatchSnapshot();
  });
});
