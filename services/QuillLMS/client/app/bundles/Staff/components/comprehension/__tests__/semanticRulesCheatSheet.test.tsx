import * as React from 'react';
import { mount } from 'enzyme';

import SemanticRulesCheatSheet from '../semanticRules/semanticRulesCheatSheet';

const mockRules = [
  { id: 1, name: 'rule_1', state: 'active', optimal: false, label: { id: 1, name: 'label_1' } },
  { id: 2, name: 'rule_2', state: 'active', optimal: false, label: { id: 2, name: 'label_2' } },
]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockRules},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

describe('SemanticRulesCheatSheet component', () => {
  const mockProps = {
    activityId: '17',
    prompt: { id: 1 }
  }
  const container = mount(
    <SemanticRulesCheatSheet {...mockProps} />
  );

  it('should render SemanticRulesCheatSheet', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DataTable', () => {
    expect(container.find(DataTable).length).toEqual(1)
  });
});
