import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import RegexRulesRouter from '../regexRules/regexRulesRouter';

const mockActivity = [{ id: 1, title: 'First' }]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { activity: mockActivity},
    error: null,
    status: "success",
    isFetching: true,
  })),
  useQueryClient: jest.fn(() => ({})),
}));

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
      <RegexRulesRouter {...mockProps} />
    </MemoryRouter>
  );
  it('should render RegexRulesRouter', () => {
    expect(container.find(RegexRulesRouter).length).toEqual(1);
  });
});
