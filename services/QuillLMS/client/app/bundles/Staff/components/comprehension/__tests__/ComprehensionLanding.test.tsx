import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import ComprehensionLanding from '../ComprehensionLanding';

const { firstBy } = jest.requireActual('thenby');

describe('ComprehensionLanding component', () => {
  const container = shallow(
    <MemoryRouter>
      <ComprehensionLanding />
    </MemoryRouter>
  );
  it('should render ComprehensionLanding', () => {
    expect(container.find('withRouter(ComprehensionLanding)').length).toEqual(1);
  });
});
