import * as React from 'react';
import moment from 'moment';
import { render, screen } from "@testing-library/react";

import ActivityDetails from '../activity_details';

jest.mock('moment', () => ({
  default: jest.requireActual('moment')
}))

describe('ActivityDetails component', () => {
  const baseData: any = { publishDate: '2016-10-17 00:05:50.361093' };

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
  })
  it('should show Due if dueDate present', () => {
    baseData.dueDate = true
    const { asFragment } = render(<ActivityDetails data={baseData} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/due/i)).toBeInTheDocument()
  })
});
