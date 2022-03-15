import * as React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import TurkSessions from '../gatherResponses/turkSessions';
import 'whatwg-fetch';

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { turkSessions: [{activity_id: 17, expires_at: '2020-12-07T22:52:41.945Z', id: 1 }]},
    error: null,
    status: "success",
    isFetching: true,
  })),
  useQueryClient: jest.fn(() => ({})),
}));

describe('TurkSessions component', () => {
  const mockProps = {
    match: {
      params: { activityId: '1' },
      isExact: true,
      path: '',
      url:''
    },
    history: createMemoryHistory(),
    location: createLocation('')
  }
  const container = mount(<TurkSessions {...mockProps} />);
  const handleClick = jest.spyOn(React, "useState");
  const setEditTurkSessionId = jest.fn();
  const setEditTurkSessionDate = jest.fn();
  const setDateError = jest.fn();
  const setShowEditOrDeleteTurkSessionModal = jest.fn();
  handleClick.mockImplementation(editTurkSessionId => [editTurkSessionId, setEditTurkSessionId]);
  handleClick.mockImplementation(editTurkSessionDate => [editTurkSessionDate, setEditTurkSessionDate]);
  handleClick.mockImplementation(dateError => [dateError, setDateError]);
  handleClick.mockImplementation(showEditOrDeleteTurkSessionModal => [showEditOrDeleteTurkSessionModal, setShowEditOrDeleteTurkSessionModal]);

  it('should render TurkSessions', () => {
    expect(container).toMatchSnapshot();
  });
  it('clicking copy should briefly update snackBarVisible to true', () => {
    const setSnackBarVisible = jest.fn();
    handleClick.mockImplementation(snackBarVisible => [snackBarVisible, setSnackBarVisible]);
    container.find("button").at(1).simulate("click");
    expect(setSnackBarVisible).toBeTruthy();
  });
  it('clicking edit should update editTurkSessionId, editTurkSessionDate, dateError & showEditOrDeleteTurkSessionModal', () => {
    container.find("button").at(2).simulate("click");
    expect(setEditTurkSessionId).toBeTruthy();
    expect(setEditTurkSessionDate).toBeTruthy();
    expect(setDateError).toBeTruthy();
    expect(setShowEditOrDeleteTurkSessionModal).toBeTruthy();
  });
  it('clicking delete should update editTurkSessionId, editTurkSessionDate, dateError & showEditOrDeleteTurkSessionModal', () => {
    container.find("button").at(3).simulate("click");
    expect(setEditTurkSessionId).toBeTruthy();
    expect(setEditTurkSessionDate).toBeTruthy();
    expect(setDateError).toBeTruthy();
    expect(setShowEditOrDeleteTurkSessionModal).toBeTruthy();
  });
});
