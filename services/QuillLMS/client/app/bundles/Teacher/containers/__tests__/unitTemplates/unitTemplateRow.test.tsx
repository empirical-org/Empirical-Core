import * as React from 'react';
import { shallow } from 'enzyme';

import UnitTemplateRow from '../../UnitTemplates/unitTemplateRow'

describe('UnitTemplateRow component', () => {
  const mockProps = {
    handleDelete: jest.fn(),
    unitTemplate: {
      diagnostic_names: []
    },
    updateUnitTemplate: jest.fn(),
  }
  it('should match snapshot', () => {
    expect(shallow(<UnitTemplateRow {...mockProps} />)).toMatchSnapshot();
  });
});
