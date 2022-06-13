import * as React from 'react';
import { shallow } from 'enzyme';

import ModelsTable from '../semanticRules/modelsTable';
import { DataTable } from '../../../../Shared/index';

const mockModels = [
  { id: 1, name: 'model_1', state: 'inactive', created_at: '', older_models: 0, labels: [{ id: 1, name: 'label_1' }] },
  { id: 2, name: 'model_2', state: 'active', created_at: '', older_models: 1, labels: [{ id: 2, name: 'label_2' }] },
]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockModels},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

jest.mock('../../../helpers/evidence/miscHelpers', () => ({
  titleCase: jest.fn().mockImplementation(() => {
    return '';
  }),
}));
const { firstBy } = jest.requireActual('thenby');

describe('LabelsTable component', () => {
  const mockProps = {
    activityId: '17',
    prompt: { id: 1 }
  }
  const container = shallow(
    <ModelsTable {...mockProps} />
  );

  it('should render ModelsTable', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DataTable', () => {
    expect(container.find(DataTable).length).toEqual(1)
  });
});
