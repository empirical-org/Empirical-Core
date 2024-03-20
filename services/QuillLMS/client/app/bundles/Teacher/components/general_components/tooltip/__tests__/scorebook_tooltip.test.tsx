import { render, screen } from "@testing-library/react";
import * as React from 'react';

import ScorebookTooltip from '../scorebook_tooltip';

describe('ScorebookTooltip component', () => {
  const mockData = {
    activity_classification_id: 2,
    activity_description: "Students rewrite sentences, adding the correct capitalization.",
    completed_attempts: 1,
    dueDate: null,
    locked: false,
    marked_complete: null,
    name: "Capitalizing Holidays, People, & Places - Mixed Topics",
    percentage: 0.9,
    publishDate: '2021-12-10T09:00:00.000Z',
    scheduled: null,
    sessions: [
      {
        percentage: 0.8,
        number_of_correct_questions: 8,
        number_of_questions: 10,
        completed_at: '2021-12-12T09:00:00.000Z',
        timespent: 120,
        grouped_key_target_skill_concepts: []
      },
      {
        percentage: 0.6,
        number_of_correct_questions: 6,
        number_of_questions: 10,
        completed_at: '2021-12-17T09:00:00.000Z',
        timespent: 240,
        grouped_key_target_skill_concepts: []
      }
    ],
    started: 0
  }

  it('should render', () => {
    const { asFragment } = render(<ScorebookTooltip data={mockData} />);
    expect(asFragment()).toMatchSnapshot();
  })

  describe('scoring', () => {
    it('should display the scoring information for each session', () => {
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/1st score/i)).toBeInTheDocument()
      expect(screen.getByText(/December 12, 2021/i)).toBeInTheDocument()
      expect(screen.getByText(/2 min/i)).toBeInTheDocument()
      expect(screen.getByText(/2nd score/i)).toBeInTheDocument()
      expect(screen.getByText(/December 17, 2021/i)).toBeInTheDocument()
      expect(screen.getByText(/4 min/i)).toBeInTheDocument()
    })
    it('should display a scoring explanation if it is a Diagnostic activity', () => {
      mockData.activity_classification_id = 4
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/The Quill Diagnostic is meant to diagnose skills to practice. Students are not provided a color-coded score or percentage score. Teachers see only a percentage score without a color./i)).toBeInTheDocument()
    })
  })

  describe('key target and skills explanation', () => {
    it('student missed the lesson', () => {
      mockData.marked_complete = true
      mockData.completed_attempts = 0
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/This student has missed this lesson. To make up this material, you can assign this lesson again to the students who missed it./i)).toBeInTheDocument()
    })
    it('activity has not been published', () => {
      mockData.scheduled = true
      mockData.completed_attempts = null
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/This scheduled activity has not been published./i)).toBeInTheDocument()
    })
    it('activity is locked', () => {
      mockData.scheduled = false
      mockData.locked = true
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/This activity is set for staggered release and has not been unlocked by this student./i)).toBeInTheDocument()
    })
    it('activity has not been completed', () => {
      mockData.locked = false
      mockData.completed_attempts = null
      const { asFragment } = render(<ScorebookTooltip data={mockData} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/This activity has not been completed./i)).toBeInTheDocument()
    })
  })

  describe('in student view', () => {
    it('should render if the percentage is below the nearly proficient threshold ', () => {
      const { asFragment } = render(<ScorebookTooltip data={{ ...mockData, percentage: 0 }} inStudentView={true} />);
      expect(asFragment()).toMatchSnapshot();
    })

    it('should render if the percentage is between the nearly proficient threshold and the proficient threshold ', () => {
      const { asFragment } = render(<ScorebookTooltip data={{ ...mockData, percentage: 0.5 }} inStudentView={true} />);
      expect(asFragment()).toMatchSnapshot();
    })

    it('should render if the percentage is above the proficient threshold ', () => {
      const { asFragment } = render(<ScorebookTooltip data={{ ...mockData, percentage: 0.9 }} inStudentView={true} />);
      expect(asFragment()).toMatchSnapshot();
    })

  })
});
