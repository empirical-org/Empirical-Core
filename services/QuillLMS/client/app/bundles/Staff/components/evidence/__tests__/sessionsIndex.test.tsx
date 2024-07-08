import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import SessionsIndex from '../activitySessions/sessionsIndex';

const queryClient = new DefaultReactQueryClient();

const history = createMemoryHistory()

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history,
  location: history.location
}

describe('SessionsIndex component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SessionsIndex {...mockProps} />
    </QueryClientProvider>
  );

  it('should render SessionsIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
