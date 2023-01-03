import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, NavLink } from 'react-router-dom';
const { firstBy } = jest.requireActual('thenby');

import Activity from '../activity';

describe('Activity component', () => {
  const container = mount(
    <MemoryRouter>
      <Activity />
    </MemoryRouter>
  );

  it('should render 5 NavLinks', () => {
    expect(container.find(NavLink).length).toEqual(5);
  });
});
