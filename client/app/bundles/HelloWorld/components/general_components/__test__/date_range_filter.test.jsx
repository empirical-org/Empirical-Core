import React from 'react';
import { shallow, mount } from 'enzyme';
import { DateRangePicker } from 'react-dates';
import DateRangeFilterOption from '../date_range_filter_option'
import moment from 'moment';

import DateRangeFilter from '../date_range_filter'

describe('DateRangeFilter component', () => {

  it('should render a DateRangePicker', () => {
    const wrapper = shallow(
      <DateRangeFilter selectDates={() => {}} />
    );
    expect(wrapper.find(DateRangePicker).length).toEqual(1);
  });

  describe('getInitialState', () => {
    it('should set beginDate and endDate based on props', () => {
      const beginDate = moment();
      const endDate = moment();
      const wrapper = shallow(
        <DateRangeFilter beginDate={beginDate} endDate={endDate} />
      );
      expect(wrapper.state().beginDate).toEqual(beginDate);
      expect(wrapper.state().endDate).toEqual(endDate);
    });

    it('should set beginDate and endDate to null if not specified in props', () => {
      const wrapper = shallow(<DateRangeFilter />);
      expect(wrapper.state().beginDate).toBe(null);
      expect(wrapper.state().endDate).toBe(null);
    });
  });

  it('the function selectDates calls the selectDates prop function, passing beginDate and endDate from state', () => {
    const mockSelectDates = jest.fn();
    const beginDate = moment();
    const endDate = moment();
    const wrapper = shallow(
      <DateRangeFilter selectDates={mockSelectDates} />
    );
    wrapper.setState({ beginDate: beginDate, endDate: endDate })
    wrapper.instance().selectDates();
    expect(mockSelectDates.mock.calls).toHaveLength(1);
    expect(mockSelectDates.mock.calls[0][0]).toEqual(beginDate);
    expect(mockSelectDates.mock.calls[0][0]).toEqual(endDate);
  });

  describe('setDateFromFilter', () => {
    const mockSelectDates = jest.fn();
    const beginDate = moment();
    const wrapper = shallow(
      <DateRangeFilter selectDates={mockSelectDates} />
    );
    wrapper.instance().setDateFromFilter(beginDate);
    it('should call selectDates on callback', () => {
      expect(mockSelectDates).toHaveBeenCalled();
    });

    it('should set state', () => {
      // TODO: mock 'moment' so we can ensure the endDate is set properly
      expect(wrapper.state().beginDate).toEqual(beginDate);
      expect(wrapper.state().focusedInput).toBe(null);
    });
  });

  it('renderFilterOptions should return DateRangeFilterOptions with appropriate props based on props', () => {
    const exampleBeginDate = moment();
    const wrapper = shallow(
      <DateRangeFilter
        filterOptions={[
          { title: 'Example', beginDate: exampleBeginDate },
          { title: 'Another Example', beginDate: moment() }
        ]}
      />
    );
    const renderFilterOptionsReturnValue = shallow(wrapper.instance().renderFilterOptions());
    expect(renderFilterOptionsReturnValue.find(DateRangeFilterOption).length).toBe(2);
  });
});
