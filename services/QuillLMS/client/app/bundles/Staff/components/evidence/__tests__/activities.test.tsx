import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import Activities from '../activities';

const queryClient = new DefaultReactQueryClient();

const history = createMemoryHistory()

describe('Activities component', () => {
  const mockProps = {
    match: {
      params: {},
      isExact: true,
      path: '',
      url:''
    },
    history,
    location: history.location,
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
