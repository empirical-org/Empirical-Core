import { shallow } from 'enzyme';
import { createMemoryHistory, } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import RuleAnalysis from '../rulesAnalysis/ruleAnalysis';

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
