import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import Model from '../semanticRules/model';
import { DataTable } from '../../../../Shared/index';

const mockModel = { id: 1, automl_model_id: '378jghai', name: 'Test Model', older_models: 0, labels: [] }
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { model: mockModel},
    error: null,
    status: "success",
    isFetching: true,
  })),
  useQueryClient: jest.fn(() => ({})),
}));

const mockProps = {
  match: {
    params: {
      activityId: '17',
      modelId: '1'
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('Model component', () => {
  const container = mount(
    <MemoryRouter>
      <Model {...mockProps} />
    </MemoryRouter>
  );
  it('should render Model', () => {
    expect(container.find(Model).length).toEqual(1);
  });
  it('should render two DataTable components', () => {
    expect(container.find(DataTable).length).toEqual(2);
  });
});
