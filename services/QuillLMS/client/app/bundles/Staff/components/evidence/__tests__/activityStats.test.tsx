import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClientProvider } from 'react-query'
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import ActivityStats from '../activityStats/activityStats';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: createMemoryHistory(),
  location: createLocation('')
}

describe('ActivityStats component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ActivityStats {...mockProps} />
    </QueryClientProvider>
  );

  it('should render ActivityStats', () => {
    expect(container).toMatchSnapshot();
  });
});
