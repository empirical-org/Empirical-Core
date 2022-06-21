import * as React from 'react';
import { shallow } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query'

import { PageLayout } from '../PageLayout';

import { defaultQueryClientOptions } from '../../../Shared';

const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

describe('PageLayout Component', () => {
  const component = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <PageLayout />
    </QueryClientProvider>
  );

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
