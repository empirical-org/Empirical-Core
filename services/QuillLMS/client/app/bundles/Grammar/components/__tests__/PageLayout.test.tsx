import { shallow } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import { PageLayout } from '../PageLayout';

import { DefaultReactQueryClient } from '../../../Shared';

const queryClient = new DefaultReactQueryClient();

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
