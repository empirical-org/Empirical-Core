import { mount, shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import { DateRangePicker } from 'react-dates';
import DateRangeFilterOption from '../date_range_filter_option';

import DateRangeFilter from '../date_range_filter';

describe('DateRangeFilter component', () => {

  describe('DateRangePicker', () => {
    it('should render', () => {
      const wrapper = shallow(
        <DateRangeFilter selectDates={() => {}} />
      );
      expect(wrapper.find(DateRangePicker).length).toEqual(1);
    });

    it('should call props.selectDates with correct params onDatesChange', () => {
      const mockSelectDates = jest.fn();
      const wrapper = mount(<DateRangeFilter selectDates={mockSelectDates} />);
      const startDate = moment();
      const endDate = moment().add(1, 'days');
      wrapper.find(DateRangePicker).props().onDatesChange({startDate, endDate});
      expect(mockSelectDates).toHaveBeenCalled();
      expect(mockSelectDates.mock.calls[0][0]).toEqual(startDate);
      expect(mockSelectDates.mock.calls[0][1]).toEqual(endDate);
    });
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
