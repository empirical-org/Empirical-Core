import * as React from 'react';
import { shallow } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query'

import { defaultQueryClientOptions } from '../../../Shared';

import { Home } from '../home';

const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

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
