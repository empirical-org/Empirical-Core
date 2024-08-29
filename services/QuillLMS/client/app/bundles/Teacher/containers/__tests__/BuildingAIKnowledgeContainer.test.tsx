import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BuildingAIKnowledge from '../BuildingAIKnowledge';
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

const mockBacklinkPath = '/interdisciplinary-science';

describe('BuildingAIKnowledge', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(requestsApi, 'requestGet').mockImplementation((url, callback) => {
      callback({ unit_templates: mockUnitTemplates });
    });
  });

  test('renders correctly in loaded state', async () => {
    const { asFragment } = render(<BuildingAIKnowledge backlinkPath={mockBacklinkPath} />);

    await waitFor(() => expect(screen.getByText('Building AI Knowledge')).toBeInTheDocument());

    expect(asFragment()).toMatchSnapshot();

    // Check for the back link
    const backLink = screen.getByRole('link', { name: 'View all interdisciplinary science activities' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', mockBacklinkPath);

    // Check for the overview section
    expect(screen.getByText('Building AI Knowledge')).toBeInTheDocument();
    expect(screen.getByText("In recent years, significant advancements have been made in artificial intelligence, and now it's expected to play an integral part in everyday life in the near future. Quill's Building AI Knowledge activities aim to provide teachers and students with an understanding of how AI works and to explain what skills and knowledge are needed to thrive in an AI-driven world.")).toBeInTheDocument();
    expect(screen.getByText('Quill Reading for Evidence activities are designed to engage students in learning about AI by exploring how it might impact their lives and the world around them. Students read a mix of stories that explore both the potential promises and pitfalls of AI. One of the main goals of this offering is to show students that AI is not just something that exists in the world; it is something that humans create. The young people reading these articles will have the opportunity to shape the future of AI, either by working with technology directly or by being informed citizens who influence laws.')).toBeInTheDocument();

    // Check for the tooltip
    expect(screen.getByText('Image credit')).toBeInTheDocument();

    // Check for the section header and buttons
    expect(screen.getByText('Reading for Evidence Activities')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();

    // Check for the partner section
    expect(screen.getByText('Paired with aiEDU for deeper learning')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Learn more about Quill's interdisciplinary science activities" })).toBeInTheDocument();
  });

  test('handles expand all and collapse all buttons correctly', async () => {
    render(<BuildingAIKnowledge backlinkPath={mockBacklinkPath} />);

    await waitFor(() => expect(screen.getByText('Building AI Knowledge')).toBeInTheDocument());

    const expandAllButton = screen.getByRole('button', { name: 'Expand all' });
    const collapseAllButton = screen.getByRole('button', { name: 'Collapse all' });

    // Expand all unit templates
    await userEvent.click(expandAllButton);
    expect(window.localStorage.getItem('buildingAIKnowledgeExpandedUnitTemplateIds')).toEqual(mockUnitTemplates.map(ut => ut.unit_template_id).join(','));

    // Collapse all unit templates
    await userEvent.click(collapseAllButton);
    expect(window.localStorage.getItem('buildingAIKnowledgeExpandedUnitTemplateIds')).toEqual(null);
  });
});
