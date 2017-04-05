import React from 'react';
import { shallow } from 'enzyme';

import DateRangeFilter from '../date_range_filter'

describe('DateRangeFilter component', () => {
  it('should render', () => {
    const wrapper = shallow(
      <DateRangeFilter selectDates={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  })
})
