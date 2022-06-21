import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query'

import RuleAnalysis from '../rulesAnalysis/ruleAnalysis';
import { defaultQueryClientOptions } from '../../../../Shared';
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


const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

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
