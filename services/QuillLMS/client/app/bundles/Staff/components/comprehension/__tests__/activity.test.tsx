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

<<<<<<< HEAD
  it('should render 3 NavLinks', () => {
=======
  it('should render 6 NavLinks', () => {
>>>>>>> 2cefd93296c048018da60e10425af34e1f0fe49a
    expect(container.find(NavLink).length).toEqual(6);
  });
});
