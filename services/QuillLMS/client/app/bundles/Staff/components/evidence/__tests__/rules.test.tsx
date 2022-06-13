import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query'

import Rules from '../configureRules/rules';
import 'whatwg-fetch';

const mockProps = {
  activityId: '17',
  prompt: [{id: 1, conjunction: 'because', text: 'test', max_attempts: 5, max_attempts_feedback: 'good try!'}],
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

const queryClient = new QueryClient()

describe('Rules component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Rules {...mockProps} />
    </QueryClientProvider>
  );

  it('should render Rules', () => {
    expect(container).toMatchSnapshot();
  });
});
