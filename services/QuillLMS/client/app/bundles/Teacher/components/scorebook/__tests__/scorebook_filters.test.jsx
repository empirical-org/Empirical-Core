import React from 'react';
import { shallow } from 'enzyme';

import ScorebookFilters from '../scorebook_filters.jsx'
import DateRangeFilter from '../../general_components/date_range_filter.jsx'
import { DropdownInput, } from '../../../../Shared/index'

describe('Scorebook component', () => {
  const wrapper = shallow(
    <ScorebookFilters
      classroomFilters={[{name: 'All Classrooms', value: ''}, { name: 'A', value: 1}]}
      selectClassroom={() => {}}
      selectDates={() => {}}
      selectedClassroom={{ name: 'A', id: 1}}
      selectedUnit={{ name: 'Something', id: 4}}
      selectUnit={() => {}}
      unitFilters={[{name: 'All Units', value: ''}, { name: 'Something', value: 4}]}
    />)

  it('renders two DropdownInputs', () => {
    expect(wrapper.find(DropdownInput).length).toEqual(2)
  })

  it('renders a DateRangeFilter', () => {
    expect(wrapper.find(DateRangeFilter).length).toEqual(1)
  })

})
