import { mount } from 'enzyme';
import * as React from 'react';

import { timeframes, grades, schools, } from './data'

import Filters from '../filters';

describe('Filters component', () => {
  const mockProps = {
    allTimeframes: timeframes,
    allSchools: schools,
    allGrades: grades,
    applyFilters: jest.fn(),
    clearFilters: jest.fn(),
    selectedGrades: grades,
    setSelectedGrades: jest.fn(),
    hasAdjustedFilters: false,
    handleSetSelectedTimeframe: jest.fn(),
    selectedTimeframe: timeframes[0],
    selectedSchools: schools,
    setSelectedSchools: jest.fn(),
    closeMobileFilterMenu: jest.fn(),
    showMobileFilterMenu: jest.fn()
  }

  describe ('when no filters have been adjusted', () => {
    it('should match snapshot', () => {
      const component = mount(<Filters {...mockProps} />);

      expect(component).toMatchSnapshot();
    });
  })

  describe ('when a filter has been adjusted', () => {
    it('should match snapshot', () => {
      const component = mount(<Filters {...mockProps} hasAdjustedFilters={true} selectedGrades={[grades[0]]} />);

      expect(component).toMatchSnapshot();
    });
  })

});
