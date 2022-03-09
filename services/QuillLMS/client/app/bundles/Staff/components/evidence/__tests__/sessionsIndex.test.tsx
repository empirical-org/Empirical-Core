import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import * as ReactTable from 'react-table';

import SessionsIndex from '../activitySessions/sessionsIndex';
import { activitySessionIndexResponseHeaders } from '../../../../../constants/evidence';

const mockActivitySessions = [
  { id: 1 },
  { id: 2 },
]

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {
      activity:  {
        title: 'merp'
      },
      activitySessions: {
        current_page: 1,
        total_pages: 1,
        total_activity_sessions: 2,
        activity_sessions: mockActivitySessions
      }
    },
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

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

describe('SessionsIndex component', () => {
  const container = shallow(<SessionsIndex {...mockProps} />);

  it('should render SessionsIndex', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a ReactTable component passing the activity sessions as props', () => {
    expect(container.find(".activity-sessions-table").length).toEqual(1);
    container.find(".activity-sessions-table").props().columns.forEach((column, i) => {
      const { accessor } = column;
      expect(activitySessionIndexResponseHeaders[i].accessor).toEqual(accessor);
    })
  });
  it('should render two dropdown inputs, one for page change and one for filtering', () => {
    expect(container.find('DropdownInput').length).toEqual(2);
  });
});
