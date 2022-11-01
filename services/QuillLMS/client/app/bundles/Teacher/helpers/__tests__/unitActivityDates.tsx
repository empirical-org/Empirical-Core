import * as React from 'react';
import { mount } from 'enzyme';
import * as moment from 'moment'

import {
  formatDateTimeForDisplay,
  DatePickerContainer
} from '../unitActivityDates';

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2022, 10, 10));
});

afterAll(() => {
  jest.useRealTimers();
});

const datePickerProps = {
  closeFunction: () => {},
  defaultText: "No date selected",
  handleClickCopyToAll: () => {},
  icon: null,
  initialValue: null,
  rowIndex: 0,
}

describe('#formatDateTimeForDisplay', () => {
  it('should return expected time formatting', () => {
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 0)))).toEqual('Apr 10, 12am')
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 12)))).toEqual('Apr 10, 12pm')
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 1, 0)))).toEqual('Apr 10, 1am')
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 12, 0)))).toEqual('Apr 10, 12pm')
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 0, 1)))).toEqual('Apr 10, 12:01am')
    expect(formatDateTimeForDisplay(moment(new Date(2022, 3, 10, 12, 30)))).toEqual('Apr 10, 12:30pm')
  });
});

describe('DatePickerContainer component', () => {
  it('renders when there is no initial value', () => {
    const wrapper = mount(
      <DatePickerContainer
        {...datePickerProps}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('renders when there is an initial value', () => {
    const wrapper = mount(
      <DatePickerContainer
        {...datePickerProps}
        initialValue={moment.utc(new Date())}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
