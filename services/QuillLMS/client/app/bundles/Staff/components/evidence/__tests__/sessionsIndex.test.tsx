import * as React from 'react';
import 'whatwg-fetch';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared/index';
import SessionsIndex from '../activitySessions/sessionsIndex';

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

describe('SessionsIndex component', () => {
  const container = mount(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SessionsIndex {...mockProps} />
    </QueryClientProvider>
  );

  it('should render SessionsIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
