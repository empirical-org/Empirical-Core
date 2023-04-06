import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import RuleAnalysis from '../rulesAnalysis/ruleAnalysis';

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
