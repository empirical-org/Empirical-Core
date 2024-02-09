import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  individualStudentPreTestSkillGroupResults,
} from './test_data'

import SkillsTable from '../skillsTable';

describe('SkillsTable component', () => {
  test('should render when it is not expandable', () => {
    const { asFragment } = render(<SkillsTable
      isExpandable={false}
      skillGroupResults={individualStudentPreTestSkillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render when it is expandable', () => {
    const { asFragment } = render(<SkillsTable
      isExpandable={true}
      skillGroupResults={individualStudentPreTestSkillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('should show every row when "Show more" is clicked', async () => {
    const rowCount = individualStudentPreTestSkillGroupResults.length;
    const defaultRowCount = 3; // Assuming this is the default row count that is initially displayed

    render(<SkillsTable isExpandable={true} skillGroupResults={individualStudentPreTestSkillGroupResults} />);

    // Check if only the default number of rows are displayed initially
    expect(screen.getAllByRole('row')).toHaveLength(defaultRowCount + 1); // +1 for the header row

    // Find and click the "Show more" button
    await userEvent.click(screen.getByText('Show more'));

    // Check if all rows are displayed after clicking the button
    expect(screen.getAllByRole('row')).toHaveLength(rowCount + 1); // +1 for the header row
  });

})
