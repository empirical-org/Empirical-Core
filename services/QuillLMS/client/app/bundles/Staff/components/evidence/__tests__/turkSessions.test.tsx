import { mount } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import TurkSessions from '../gatherResponses/turkSessions';

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
