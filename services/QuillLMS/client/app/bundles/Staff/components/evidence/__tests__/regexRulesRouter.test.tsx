import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import RegexRulesRouter from '../regexRules/regexRulesRouter';
import { DefaultReactQueryClient } from '../../../../Shared/index';

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
    pathname: 'regex-rules'
  }
}

describe('RegexRulesRouter component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <RegexRulesRouter {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render RegexRulesRouter', () => {
    expect(container.find(RegexRulesRouter).length).toEqual(1);
  });
});
