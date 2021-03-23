import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import SemanticRulesIndex from '../semanticRules/SemanticRulesIndex';

const mockActivity = [{ id: 1, title: 'First' }]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { activity: mockActivity},
    error: null,
    status: "success",
    isFetching: true,
  })),
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
    pathname: 'but'
  }
}

describe('SemanticRulesIndex component', () => {
  const container = mount(
    <MemoryRouter>
      <SemanticRulesIndex {...mockProps} />
    </MemoryRouter>
  );
  it('should render SemanticRulesIndex', () => {
    expect(container.find(SemanticRulesIndex).length).toEqual(1);
  });
});
