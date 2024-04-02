import { mount } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import RegexRulesRouter from '../regexRules/regexRulesRouter';

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
