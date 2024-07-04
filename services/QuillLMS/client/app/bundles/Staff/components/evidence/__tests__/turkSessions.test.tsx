import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import TurkSessions from '../gatherResponses/turkSessions';

const queryClient = new DefaultReactQueryClient();

const history = createMemoryHistory()

describe('TurkSessions component', () => {
  const mockProps = {
    match: {
      params: { activityId: '1' },
      isExact: true,
      path: '',
      url:''
    },
    history,
    location: history.location
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
