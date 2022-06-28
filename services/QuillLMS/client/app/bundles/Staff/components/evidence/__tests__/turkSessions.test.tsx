import * as React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClientProvider } from 'react-query';

import TurkSessions from '../gatherResponses/turkSessions';
import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';

const queryClient = new DefaultReactQueryClient();

describe('TurkSessions component', () => {
  const mockProps = {
    match: {
      params: { activityId: '1' },
      isExact: true,
      path: '',
      url:''
    },
    history: createMemoryHistory(),
    location: createLocation('')
  }
  const container = mount(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <TurkSessions {...mockProps} />
    </QueryClientProvider>
  );

  it('should render TurkSessions', () => {
    expect(container).toMatchSnapshot();
  });
});
