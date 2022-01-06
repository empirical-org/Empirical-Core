import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import PlagiarismRulesIndex from '../plagiarismRules/plagiarismRulesIndex';
import { mockActivity } from '../__mocks__/data';
import 'whatwg-fetch';

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {
      rules: mockRules,
      activity: mockActivity
    },
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

const mockRules = [
  { id: 1, name: 'rule_1', state: 'active', plagiarism_texts: [{ text: 'do not plagiarize!' }], label: { id: 1, name: 'label_1' }, prompt_ids: [7] },
  { id: 2, name: 'rule_2', state: 'active', plagiarism_texts: [{ text: 'seriously!' }], label: { id: 2, name: 'label_2' }, prompt_ids: [9] },
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
