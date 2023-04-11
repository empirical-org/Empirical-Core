import { shallow } from 'enzyme';
import * as React from 'react';

import { UnitTemplateActivityRow } from '../../UnitTemplates/unitTemplateActivityRow';

describe('UnitTemplateActivityRow component', () => {
  const mockProps = {
    activities: [],
    handleRemove: jest.fn()
  }
  it('should match snapshot', () => {
    expect(shallow(<UnitTemplateActivityRow {...mockProps} />)).toMatchSnapshot();
  });
});
