import * as React from 'react';
import { render, screen } from '@testing-library/react';

import CoursePageActivity from '../course_page_activity';

const mockActivity = {
  display_name: 'Test Activity',
  description: 'This is a test activity',
  paired_oer_asset_name: 'Test OER Asset',
  paired_oer_asset_link: 'https://example.com/oer',
  assigned_student_count: 10,
  completed_student_count: 5,
  link_for_report: 'https://example.com/report',
  average_score: 85,
};

describe('CoursePageActivity', () => {
  test('renders correctly when link_for_report is provided', () => {
    const { asFragment } = render(<CoursePageActivity activity={mockActivity} />);

    expect(asFragment()).toMatchSnapshot();

    // Check for display name and description
    expect(screen.getByText(mockActivity.display_name)).toBeInTheDocument();
    expect(screen.getByText(mockActivity.description)).toBeInTheDocument();

    // Check for OER asset link
    const oerLink = screen.getByRole('link', { name: mockActivity.paired_oer_asset_name });
    expect(oerLink).toBeInTheDocument();
    expect(oerLink).toHaveAttribute('href', mockActivity.paired_oer_asset_link);

    // Check for results section
    const resultsLink = screen.getByRole('link', { name: 'View results' });
    expect(resultsLink).toBeInTheDocument();
    expect(resultsLink).toHaveAttribute('href', mockActivity.link_for_report);

    expect(screen.getByText(`5 of 10 students completed`)).toBeInTheDocument();
    expect(screen.getByText('Average score: 85%')).toBeInTheDocument();
  });

  test('renders correctly when link_for_report is not provided', () => {
    const modifiedActivity = { ...mockActivity, link_for_report: null };
    const { asFragment } = render(<CoursePageActivity activity={modifiedActivity} />);

    expect(asFragment()).toMatchSnapshot();

    // Check for display name and description
    expect(screen.getByText(modifiedActivity.display_name)).toBeInTheDocument();
    expect(screen.getByText(modifiedActivity.description)).toBeInTheDocument();

    // Check for OER asset link
    const oerLink = screen.getByRole('link', { name: modifiedActivity.paired_oer_asset_name });
    expect(oerLink).toBeInTheDocument();
    expect(oerLink).toHaveAttribute('href', modifiedActivity.paired_oer_asset_link);

    // Check for results section
    const resultsButton = screen.getByText('View results').closest('button');
    expect(resultsButton).toBeInTheDocument();
    expect(resultsButton).toBeDisabled();
  });
});
