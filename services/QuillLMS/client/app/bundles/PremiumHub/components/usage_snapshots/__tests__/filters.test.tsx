import { mount } from 'enzyme';
import { render, screen, }  from "@testing-library/react";
import * as React from 'react';

import { timeframes, grades, schools, teachers, classrooms,} from './data'

import Filters from '../filters';

describe('Filters component', () => {
  const mockProps = {
    availableTimeframes: timeframes,
    availableSchools: schools,
    availableGrades: grades,
    availableTeachers: teachers,
    availableClassrooms: classrooms,
    applyFilters: jest.fn(),
    clearFilters: jest.fn(),
    selectedGrades: grades,
    setSelectedGrades: jest.fn(),
    hasAdjustedFilters: false,
    handleSetSelectedTimeframe: jest.fn(),
    selectedTimeframe: timeframes[0],
    selectedSchools: schools,
    selectedTeachers: teachers,
    selectedClassrooms: classrooms,
    setSelectedTeachers: jest.fn(),
    setSelectedClassrooms: jest.fn(),
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

  describe('when availableClassrooms is empty', () => {
    test('a disabled classrooms dropdown should be rendered', () => {
      const { asFragment } = render(<Filters {...mockProps} availableClassrooms={[]} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByRole('button', { name: /all classrooms selected/i })).toHaveAttribute('disabled')
    })
  })

});
