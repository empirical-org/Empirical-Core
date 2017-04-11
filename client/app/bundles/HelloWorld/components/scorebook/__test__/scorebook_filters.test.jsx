import React from 'react';
import { shallow } from 'enzyme';

import ScorebookFilters from '../scorebook_filters.jsx'
import DropdownFilter from '../../progress_reports/dropdown_filter.jsx'
import DateRangeFilter from '../../general_components/date_range_filter.jsx'

describe('Scorebook component', () => {
  const wrapper = shallow(
    <ScorebookFilters
        selectedClassroom={{ name: 'A', id: 1}}
        selectedUnit={{ name: 'Something', id: 4}}
        unitFilters={[{name: 'All Units', value: ''}, { name: 'Something', value: 4}]}
        classroomFilters={[{name: 'All Classrooms', value: ''}, { name: 'A', value: 1}]}
        selectDates={() => {}}
        selectClassroom={() => {}}
        selectUnit={() => {}}
    />)

  it('renders two DropdownFilters', () => {
    expect(wrapper.find(DropdownFilter).length).toEqual(2)
  })

  it('renders a DateRangeFilter', () => {
    expect(wrapper.find(DateRangeFilter).length).toEqual(1)
  })

})
