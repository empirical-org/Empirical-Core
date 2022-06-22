import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import PlagiarismRulesRouter from '../plagiarismRules/plagiarismRulesRouter';
import { DefaultReactQueryClient } from '../../../../Shared';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {},
    isExact: true,
    path: '',
    url:''
  },
  history: {},
  location: {
    pathname: 'plagiarism-rules'
  }
}

describe('PlagiarismRulesRouter component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <PlagiarismRulesRouter {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render PlagiarismRulesRouter', () => {
    expect(container.find(PlagiarismRulesRouter).length).toEqual(1);
  });
});
