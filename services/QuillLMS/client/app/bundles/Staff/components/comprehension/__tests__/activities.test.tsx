import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import 'whatwg-fetch';

import Activities from '../activities';
import { DataTable } from '../../../../Shared/index';

const mockActivities = [{ id: 1, title: 'First' }, { id: 2, title: 'Second' }]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { activities: mockActivities},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

describe('Activities component', () => {
  const mockProps = {
    match: {
      params: {},
      isExact: true,
      path: '',
      url:''
    },
    history: createMemoryHistory(),
    location: createLocation('')
  }
  const container = shallow(
      <Activities {...mockProps} />
  );

  it('should render a DataTable passing activites', () => {
    expect(container.find(DataTable).length).toEqual(1)
  });
});
