import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import 'whatwg-fetch';
import { QueryClientProvider } from 'react-query'

import Activities from '../activities';
import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

describe('Activities component', () => {
  const mockProps = {
    match: {
      params: {},
      isExact: true,
      path: '',
      url:''
    },
    history: createMemoryHistory(),
    location: createLocation('')
  }
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Activities {...mockProps} />
    </QueryClientProvider>
  );

  it('should render an Activities component', () => {
    expect(container.find(Activities).length).toEqual(1)
  });
});
