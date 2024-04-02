import { render, screen } from "@testing-library/react";
import * as React from 'react';

import ActivityDetails from '../activity_details';

describe('ActivityDetails component', () => {
  const baseData: any = { publishDate: '2021-10-17' };

  it('should render', () => {
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
  })
  it('should show Objectives section if activity_description present', () => {
    baseData.activity_description = "This is a test description"
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/objectives/i)).toBeInTheDocument()
    expect(screen.getByText(/this is a test description/i)).toBeInTheDocument()
  })
  it('should show Scheduled For if scheduled is true', () => {
    baseData.scheduled = true
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/scheduled for/i)).toBeInTheDocument()
    expect(screen.getByText(/this is a test description/i)).toBeInTheDocument()
  })
  it('should show Published if scheduled is false', () => {
    baseData.scheduled = false
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/published/i)).toBeInTheDocument()
    expect(screen.getByText(/October 17, 2021/i)).toBeInTheDocument()
  })
  it('should show due date if dueDate present', () => {
    baseData.dueDate = '2021-10-21'
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/October 21, 2021/i)).toBeInTheDocument()
  })
});
