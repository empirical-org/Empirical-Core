import React from 'react';
import DatePicker from 'react-datepicker'
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import DateRangeFilter from '../date_range_filter'

describe('DateRangeFilter component', () => {

  it('should render two DatePickers', () => {
    const wrapper = shallow(
      <DateRangeFilter selectDates={() => {}} />
    );
    expect(wrapper.find(DatePicker).length).toEqual(2)
  })

  it('the function selectBeginDate changes the beginDate in state', () => {
    const wrapper = shallow(
      <DateRangeFilter selectDates={() => {}} />
    );
    const lastWeek = moment().day(-7)
    wrapper.instance().selectBeginDate(lastWeek)
    expect(wrapper.state('beginDate')).toEqual(lastWeek)
  })

  it('the function selectEndDate changes the endDate in state', () => {
    const wrapper = shallow(
      <DateRangeFilter selectDates={() => {}} />
    );
    const nextWeek = moment().day(7)
    wrapper.instance().selectEndDate(nextWeek)
    expect(wrapper.state('endDate')).toEqual(nextWeek)
  })

  it('the function selectDates calls the selectDates prop function', () => {
    const mockSelectDates = jest.fn();
    const wrapper = shallow(
      <DateRangeFilter selectDates={mockSelectDates} />
    );
    wrapper.instance().selectDates()
    expect(mockSelectDates.mock.calls).toHaveLength(1)
  })
})
