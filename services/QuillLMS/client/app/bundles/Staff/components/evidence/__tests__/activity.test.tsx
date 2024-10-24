import { mount } from 'enzyme';
import * as React from 'react';
import { MemoryRouter, NavLink } from 'react-router-dom';
const { firstBy } = jest.requireActual('thenby');
import { QueryClientProvider } from 'react-query';

import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

import Activity from '../activity';

describe('Activity component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Activity />
      </QueryClientProvider>
    </MemoryRouter>
  );

  it('should render 6 NavLinks', () => {
    expect(container.find(NavLink).length).toEqual(6);
  });
});
