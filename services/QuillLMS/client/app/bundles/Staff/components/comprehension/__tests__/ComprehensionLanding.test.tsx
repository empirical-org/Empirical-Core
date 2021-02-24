import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import ComprehensionLanding from '../ComprehensionLanding';

describe('ComprehensionLanding component', () => {
  const container = mount(
    <MemoryRouter>
      <ComprehensionLanding />
    </MemoryRouter>
  );
  it('should render ComprehensionLanding', () => {
    expect(container.find('withRouter(ComprehensionLanding)').length).toEqual(1);
  });
});
