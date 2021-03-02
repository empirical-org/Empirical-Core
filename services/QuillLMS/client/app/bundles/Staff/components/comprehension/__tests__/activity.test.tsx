import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, NavLink } from 'react-router-dom';

import Activity from '../activity';

describe('Activity component', () => {
  const container = mount(
    <MemoryRouter>
      <Activity />
    </MemoryRouter>
  );

  it('should render 2 NavLinks', () => {
    expect(container.find(NavLink).length).toEqual(2);
  });
});
