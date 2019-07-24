import React from 'react';
import { shallow } from 'enzyme';

import DatePicker from '../date_picker';

import ReactDatePicker from 'react-datepicker';

describe('DatePicker component', () => {

  it('should render react-datepicker', () => {
    const wrapper = shallow(
      <DatePicker />
    );
    expect(wrapper.find(ReactDatePicker).exists()).toBe(true);
  });

  it('should pass state.startDate to selected prop', () => {
    const wrapper = shallow(
      <DatePicker />
    );
    wrapper.setState({startDate: 'date'});
    expect(wrapper.prop('selected')).toBe('date');
  });

});
