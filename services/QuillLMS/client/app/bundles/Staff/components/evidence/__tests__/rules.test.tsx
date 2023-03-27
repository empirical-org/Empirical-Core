import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import Rules from '../configureRules/rules';

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


const queryClient = new DefaultReactQueryClient();

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
