import * as React from 'react';
import { shallow } from 'enzyme';

import UnitTemplateFilterInputs from '../../UnitTemplates/unitTemplateFilterInputs'

describe('UnitTemplateFilterInputs component', () => {
  const mockProps = {
    handleRadioChange: jest.fn(),
    searchByActivityPack: true,
    searchInput: '',
    handleSearch: jest.fn(),
    switchFlag: jest.fn(),
    flag: '',
    options: [],
    diagnostics: [],
    diagnostic: {},
    switchDiagnostic: jest.fn(),
    newUnitTemplate: {}
  }
  it('should match snapshot', () => {
    expect(shallow(<UnitTemplateFilterInputs {...mockProps} />)).toMatchSnapshot();
  });

});
