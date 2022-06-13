import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import SemanticLabelsIndex from '../semanticRules/semanticLabelsIndex';

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
    pathname: 'but'
  }
}

describe('SemanticLabelsIndex component', () => {
  const container = mount(
    <MemoryRouter>
      <SemanticLabelsIndex {...mockProps} />
    </MemoryRouter>
  );
  it('should render SemanticLabelsIndex', () => {
    expect(container.find(SemanticLabelsIndex).length).toEqual(1);
  });
});
