import { mount } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../../../Shared';
import PlagiarismRulesRouter from '../plagiarismRules/plagiarismRulesRouter';

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
