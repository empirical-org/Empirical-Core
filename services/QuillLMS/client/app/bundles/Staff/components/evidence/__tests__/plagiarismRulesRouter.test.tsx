import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import PlagiarismRulesRouter from '../plagiarismRules/plagiarismRulesRouter';

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
    pathname: 'plagiarism-rules'
  }
}

describe('PlagiarismRulesRouter component', () => {
  const container = mount(
    <MemoryRouter>
      <PlagiarismRulesRouter {...mockProps} />
    </MemoryRouter>
  );
  it('should render PlagiarismRulesRouter', () => {
    expect(container.find(PlagiarismRulesRouter).length).toEqual(1);
  });
});
