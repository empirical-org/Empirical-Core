import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { Link } from 'react-router-dom';

import { DataTable } from '../../../../Shared/index';
import RegexRulesIndex from '../regexRules/regexRulesIndex';
import 'whatwg-fetch';

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockRules },
    error: null,
    status: "success",
    isFetching: true,
  })),
  useQueryClient: jest.fn(() => ({})),
}));
const { firstBy } = jest.requireActual('thenby');

const mockRules = [
  { id: 1, name: 'rule_1', state: 'active', optimal: false, label: { id: 1, name: 'label_1' }, regex_rules: [{id: 1, regex_text: 'test1'}, {id: 2, regex_text: 'test2'}] },
  { id: 2, name: 'rule_2', state: 'active', optimal: false, label: { id: 2, name: 'label_2' }, regex_rules: [{id: 1, regex_text: 'test1'}, {id: 2, regex_text: 'test2'}] },
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

describe('RegexRulesIndex component', () => {
  const container = shallow(<RegexRulesIndex {...mockProps} />);

  it('should render RegexRulesIndex', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render three separate DataTables and buttons for each regex rule type', () => {
    expect(container.find(DataTable).length).toEqual(3);
    expect(container.find(Link).at(0).props().children).toEqual('Add Sentence Structure Regex Rule')
    expect(container.find(Link).at(1).props().children).toEqual('Add Post-Topic Regex Rule')
    expect(container.find(Link).at(2).props().children).toEqual('Add Typo Regex Rule')
  });
});
