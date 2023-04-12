import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import PlagiarismRulesIndex from '../plagiarismRules/plagiarismRulesIndex';

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
