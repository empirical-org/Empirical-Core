import * as React from 'react';
import moment from 'moment';
import { render } from "@testing-library/react";

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
    sessions: [{ grouped_key_target_skill_concepts: [] }],
    started: 0
  }
  it('should render', () => {
    const { asFragment } = render(<ScorebookTooltip data={mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
});
