import * as React from 'react';
import moment from 'moment';
import { render, screen } from "@testing-library/react";

import ScorebookTooltip from '../scorebook_tooltip';

jest.mock('moment', () => ({
  default: jest.requireActual('moment')
}))

describe('ScorebookTooltip component', () => {
  const mockProps = {
    activity_classification_id: 2,
    activity_description: "Students rewrite sentences, adding the correct capitalization.",
    completed_attempts: 1,
    dueDate: null,
    locked: false,
    marked_complete: null,
    name: "Capitalizing Holidays, People, & Places - Mixed Topics",
    percentage: 0.9,
    publishDate: null,
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
    const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
  describe('scoring', () => {
    it('should display the scoring information for each session', () => {
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/1st score/i)).toBeInTheDocument()
      expect(screen.getByText(/December 12, 2021/i)).toBeInTheDocument()
      expect(screen.getByText(/2 min/i)).toBeInTheDocument()
      expect(screen.getByText(/2nd score/i)).toBeInTheDocument()
      expect(screen.getByText(/December 17, 2021/i)).toBeInTheDocument()
      expect(screen.getByText(/4 min/i)).toBeInTheDocument()
    })
    it('should display a scoring explanation if it is a Diagnostic activity', () => {
      mockProps.activity_classification_id = 4
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      expect(screen.getByText(/The Quill Diagnostic is meant to diagnose skills to practice. Students are not provided a color-coded score or percentage score. Teachers see only a percentage score without a color./i)).toBeInTheDocument()
    })
  })
  describe('key target and skills explanation', () => {
    it('student missed the lesson', () => {
      mockProps.marked_complete = true
      mockProps.completed_attempts = 0
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      console.log(screen.debug())
      expect(screen.getByText(/This student has missed this lesson. To make up this material, you can assign this lesson again to the students who missed it./i)).toBeInTheDocument()
    })
    it('activity has not been published', () => {
      mockProps.scheduled = true
      mockProps.completed_attempts = null
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      console.log(screen.debug())
      expect(screen.getByText(/This scheduled activity has not been published./i)).toBeInTheDocument()
    })
    it('activity is locked', () => {
      mockProps.scheduled = false
      mockProps.locked = true
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      console.log(screen.debug())
      expect(screen.getByText(/This activity is set for staggered release and has not been unlocked by this student./i)).toBeInTheDocument()
    })
    it('activity has not been completed', () => {
      mockProps.locked = false
      mockProps.completed_attempts = null
      const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
      expect(asFragment()).toMatchSnapshot();
      console.log(screen.debug())
      expect(screen.getByText(/This activity has not been completed./i)).toBeInTheDocument()
    })
  })
});
