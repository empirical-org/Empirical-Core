import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import ActivityTableContainer from '../activity_table_container'
import { DEFAULT } from '../shared'

describe('ActivityTableContainer component', () => {
  const props = {
    filteredActivities: activities,
    selectedActivities: [],
    toggleActivitySelection: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    search: '',
    handleSearch: () => {},
    undoLastFilter: () => {},
    resetAllFilters: () => {},
    setShowMobileFilterMenu: () => {},
    setShowMobileSortMenu: () => {},
    sort: DEFAULT,
    setSort: () => {}
  }

  it('should render', () => {
    const wrapper = mount(<ActivityTableContainer {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

})
