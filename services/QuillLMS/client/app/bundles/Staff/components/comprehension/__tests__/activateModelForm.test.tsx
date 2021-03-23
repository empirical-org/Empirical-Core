import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import ActivateModelForm from '../semanticRules/activatemodelForm';
import { DataTable } from '../../../../Shared/index';

const mockModel = { id: 2, automl_model_id: '378jghai', name: 'Test Model', older_models: 0, labels: [{ id: 1, name: "label_1"}] }
const mockModels = [
  { id: 1, name: 'model_1', state: 'inactive', created_at: '', older_models: 0, labels: [{ id: 1, name: 'label_1' }] },
  { id: 2, name: 'model_2', state: 'active', created_at: '', older_models: 1, labels: [{ id: 2, name: 'label_2' }] },
];
const mockRules = [
  { id: 1, name: 'rule_1', state: 'active', optimal: false, label: { id: 1, name: 'label_1' } },
  { id: 2, name: 'rule_2', state: 'active', optimal: false, label: { id: 2, name: 'label_2' } },
]

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { model: mockModel},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockModels},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { rules: mockRules},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

const mockProps = {
  match: {
    params: {
      modelId: '1',
      activityId: '17',
      promptId: '1'
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('ActivateModelForm component', () => {
  const container = mount(
    <MemoryRouter>
      <ActivateModelForm {...mockProps} />
    </MemoryRouter>
  );
  it('should render ActivateModelForm', () => {
    expect(container.find(ActivateModelForm).length).toEqual(1);
  });
  it('should render two DataTable components', () => {
    expect(container.find(DataTable).length).toEqual(2);
  });
});
