import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import ActivitySettingsWrapper from '../configureSettings/activitySettingsWrapper';

const mockActivity = [{ id: 1, title: 'First' }]
jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { activity: mockActivity},
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

const mockProps = {
  match: {
    params: {
      activityId: 1
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('ActivitySettingsWrapper component', () => {
  const container = mount(
    <MemoryRouter>
      <ActivitySettingsWrapper {...mockProps} />
    </MemoryRouter>
  );
  it('should render ActivitySettingsWrapper', () => {
    expect(container.find(ActivitySettingsWrapper).length).toEqual(1);
  });
});
