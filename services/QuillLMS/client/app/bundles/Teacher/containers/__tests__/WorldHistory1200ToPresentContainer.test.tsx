import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WorldHistory1200ToPresent from '../WorldHistory1200ToPresent';
import * as requestsApi from '../../../../modules/request';

const mockUnitTemplates = [
  {
    unit_template_id: 1,
    display_name: 'Unit 1',
    description: 'Description of Unit 1',
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
    oer_unit_teacher_guide: 'https://example.com/oer-teacher-guide',
    oer_unit_website: 'https://example.com/oer-website',
    oer_unit_number: '123',
    quill_teacher_guide_href: 'https://example.com/quill-teacher-guide',
  },
];

const mockBacklinkPath = '/social-studies';

describe('WorldHistory1200ToPresent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => {
      callback({ unit_templates: mockUnitTemplates });
    });
  });

  test('renders correctly in loaded state', async () => {
    const { asFragment } = render(<WorldHistory1200ToPresent backlinkPath={mockBacklinkPath} />);

    await waitFor(() => expect(screen.getByText('World History: 1200 CE - Present')).toBeInTheDocument());

    expect(asFragment()).toMatchSnapshot();

    // Check for the back link
    const backLink = screen.getByRole('link', { name: 'View all social studies activities' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', mockBacklinkPath);

    // Check for the overview section
    expect(screen.getByText('World History: 1200 CE - Present')).toBeInTheDocument();
    expect(screen.getByText('World history, or the story of our past, belongs to everyone: it helps us understand where we\'ve come from, how we got here, and where we might go next. In this course, students explore that shared human story beginning with the rise of complex, connected societies and ending with the emergence of the globalized world in which we live today.')).toBeInTheDocument();
    expect(screen.getByText('Quill Reading for Evidence activities provide a deep dive into key moments and movements from the period spanning 1200 CE to the present, helping students expand their content knowledge while building core reading and writing skills.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Teacher Resources' })).toBeInTheDocument();

    // Check for the tooltip
    expect(screen.getByText('Image credit')).toBeInTheDocument();

    // Check for the section header and buttons
    expect(screen.getByText('Reading for Evidence Activities')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();

    // Check for the partner section
    expect(screen.getByText('Paired with the OER Project for deeper learning')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More About Quill’s Social Studies Activities' })).toBeInTheDocument();
  });

  test('handles expand all and collapse all buttons correctly', async () => {
    render(<WorldHistory1200ToPresent backlinkPath={mockBacklinkPath} />);

    await waitFor(() => expect(screen.getByText('World History: 1200 CE - Present')).toBeInTheDocument());

    const expandAllButton = screen.getByRole('button', { name: 'Expand all' });
    const collapseAllButton = screen.getByRole('button', { name: 'Collapse all' });

    // Expand all unit templates
    await userEvent.click(expandAllButton);
    expect(window.localStorage.getItem('worldHistory1200ToPresentExpandedUnitTemplateIds')).toEqual(mockUnitTemplates.map(ut => ut.unit_template_id).join(','));

    // Collapse all unit templates
    await userEvent.click(collapseAllButton);
    expect(window.localStorage.getItem('worldHistory1200ToPresentExpandedUnitTemplateIds')).toEqual(null);
  });
});
