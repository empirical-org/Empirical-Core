import * as React from 'react';
import { render, } from "@testing-library/react";

import FilterScope from '../filterScope';

const mockProps = {
  selectedGrades: [],
  hasAdjustedFiltersFromDefault: false,
  selectedTimeframe: 'this-school-year',
  selectedSchools: [],
  selectedTeachers: [],
  selectedClassrooms: [],
  diagnosticIdForStudentCount: [],
  pusherChannel: null,
  filterScopeAction: '',
  handleSetApplyFilterButtonClicked: jest.fn(),
  handleSetFilterScopeAction: jest.fn()
}

describe('FilterScope component', () => {
  test('it should render', () => {
    const { asFragment } = render(<FilterScope {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
