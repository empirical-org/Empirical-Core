import { shallow } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import { DefaultReactQueryClient } from '../../../Shared';

import { Home } from '../home';

const queryClient = new DefaultReactQueryClient();

describe('Home Component', () => {
  const component = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Home />
    </QueryClientProvider>
  );

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
