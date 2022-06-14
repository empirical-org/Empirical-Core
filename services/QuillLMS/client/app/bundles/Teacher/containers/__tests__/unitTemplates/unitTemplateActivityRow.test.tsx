import * as React from 'react';
import { shallow } from 'enzyme';

import {UnitTemplateActivityRow }from '../../UnitTemplates/unitTemplateActivityRow'

describe('UnitTemplateActivityRow component', () => {
  const mockProps = {
    activities: [],
    handleRemove: jest.fn()
  }
  it('should match snapshot', () => {
    expect(shallow(<UnitTemplateActivityRow {...mockProps} />)).toMatchSnapshot();
  });
});
