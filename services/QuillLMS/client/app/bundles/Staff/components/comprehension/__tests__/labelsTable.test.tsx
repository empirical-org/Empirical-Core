import * as React from 'react';
import { shallow } from 'enzyme';

import LabelsTable from '../semanticRules/labelsTable';
import { DataTable } from '../../../../Shared/index';

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

describe('LabelsTable component', () => {
  const mockProps = {
    activityId: '17',
    prompt: { id: 1 }
  }
  const container = shallow(
    <LabelsTable {...mockProps} />
  );

  it('should render LabelsTable', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DataTable', () => {
    expect(container.find(DataTable).length).toEqual(1)
  });
});
