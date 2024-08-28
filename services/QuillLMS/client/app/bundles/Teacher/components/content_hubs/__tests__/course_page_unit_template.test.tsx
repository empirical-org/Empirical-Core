import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CoursePageUnitTemplate from '../course_page_unit_template';

const mockUnitTemplate = {
  display_name: 'Test Unit',
  activities: [
    {
      display_name: 'Activity 1',
      description: 'Activity 1 description',
      paired_oer_asset_name: 'OER 1',
      paired_oer_asset_link: 'https://example.com/oer1',
      assigned_student_count: 10,
      completed_student_count: 5,
      link_for_report: 'https://example.com/report1',
      average_score: 85,
    },
    {
      display_name: 'Activity 2',
      description: 'Activity 2 description',
      paired_oer_asset_name: 'OER 2',
      paired_oer_asset_link: 'https://example.com/oer2',
      assigned_student_count: 20,
      completed_student_count: 10,
      link_for_report: 'https://example.com/report2',
      average_score: 90,
    },
  ],
  all_oer_articles: 'https://example.com/oer-articles',
  all_quill_articles_href: 'https://example.com/quill-articles',
  description: 'This is a test unit template',
  oer_unit_teacher_guide: 'https://example.com/oer-teacher-guide',
  oer_unit_website: 'https://example.com/oer-website',
  oer_unit_number: '123',
  quill_teacher_guide_href: 'https://example.com/quill-teacher-guide',
  unit_template_id: 'unit-template-1',
};

const mockToggleUnitTemplateExpansion = jest.fn();

describe('CoursePageUnitTemplate', () => {
  test('renders correctly in unexpanded state', () => {
    const { asFragment } = render(
      <CoursePageUnitTemplate
        expandedUnitTemplateIds={[]}
        toggleUnitTemplateExpansion={mockToggleUnitTemplateExpansion}
        unitTemplate={mockUnitTemplate}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    // Check initial elements
    expect(screen.getByText(mockUnitTemplate.display_name)).toBeInTheDocument();
    expect(screen.getByText(mockUnitTemplate.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Preview & Assign' })).toHaveAttribute(
      'href',
      `/assign/featured-activity-packs/${mockUnitTemplate.unit_template_id}`
    );
    expect(screen.getByLabelText(`Expand ${mockUnitTemplate.display_name} activities`)).toBeInTheDocument();
  });

  test('renders correctly in expanded state', () => {
    const { asFragment } = render(
      <CoursePageUnitTemplate
        expandedUnitTemplateIds={[mockUnitTemplate.unit_template_id]}
        toggleUnitTemplateExpansion={mockToggleUnitTemplateExpansion}
        unitTemplate={mockUnitTemplate}
      />
    );

    expect(asFragment()).toMatchSnapshot();

    // Check expanded elements
    expect(screen.getByText(mockUnitTemplate.display_name)).toBeInTheDocument();
    expect(screen.getByText(mockUnitTemplate.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Preview & Assign' })).toHaveAttribute(
      'href',
      `/assign/featured-activity-packs/${mockUnitTemplate.unit_template_id}`
    );
    expect(screen.getByLabelText(`Collapse ${mockUnitTemplate.display_name} activities`)).toBeInTheDocument();

    // Check Quill resource links
    expect(screen.getByText('Quill Teacher Guide')).toBeInTheDocument();
    expect(screen.getByText('Download all unit texts')).toBeInTheDocument();

    // Check activities section
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();

    // Check OER resources section
    expect(screen.getByText(`OER Project Unit ${mockUnitTemplate.oer_unit_number} Resources`)).toBeInTheDocument();
    expect(screen.getByText(`OER Project Unit ${mockUnitTemplate.oer_unit_number} website`)).toBeInTheDocument();
    expect(screen.getByText(`OER Project Unit ${mockUnitTemplate.oer_unit_number} teacher guide`)).toBeInTheDocument();
    expect(screen.getByText(`Download all OER Project Unit ${mockUnitTemplate.oer_unit_number} articles`)).toBeInTheDocument();
  });

  test('handles toggle expansion correctly', async () => {
    render(
      <CoursePageUnitTemplate
        expandedUnitTemplateIds={[]}
        toggleUnitTemplateExpansion={mockToggleUnitTemplateExpansion}
        unitTemplate={mockUnitTemplate}
      />
    );

    const toggleButton = screen.getByLabelText(`Expand ${mockUnitTemplate.display_name} activities`);
    await userEvent.click(toggleButton);

    expect(mockToggleUnitTemplateExpansion).toHaveBeenCalledWith(mockUnitTemplate.unit_template_id);
  });
});
