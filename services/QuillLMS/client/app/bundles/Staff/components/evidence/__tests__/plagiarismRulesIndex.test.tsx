import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClientProvider } from 'react-query'
import 'whatwg-fetch';

import PlagiarismRulesIndex from '../plagiarismRules/plagiarismRulesIndex';
import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

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

describe('PlagiarismRulesIndex component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <PlagiarismRulesIndex {...mockProps} />
    </QueryClientProvider>
  );

  it('should render PlagiarismRulesIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
