import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import PlagiarismRulesIndex from '../plagiarismRules/plagiarismRulesIndex';
import 'whatwg-fetch';

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockRules},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));
const { firstBy } = jest.requireActual('thenby');

const mockRules = [
  { id: 1, name: 'rule_1', state: 'active', optimal: false, label: { id: 1, name: 'label_1' } },
  { id: 2, name: 'rule_2', state: 'active', optimal: false, label: { id: 2, name: 'label_2' } },
]
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
  const container = shallow(<PlagiarismRulesIndex {...mockProps} />);

  it('should render PlagiarismRulesIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
