import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query'

import RuleAnalysis from '../rulesAnalysis/ruleAnalysis';
import { DefaultReactQueryClient } from '../../../../Shared';
import 'whatwg-fetch';

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


const queryClient = new DefaultReactQueryClient();

describe('RuleAnalysis component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RuleAnalysis {...mockProps} />
    </QueryClientProvider>
  );

  it('should render RuleAnalysis', () => {
    expect(container).toMatchSnapshot();
  });
});
