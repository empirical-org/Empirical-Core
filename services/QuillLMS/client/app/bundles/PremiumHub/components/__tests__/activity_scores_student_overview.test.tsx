import * as React from "react";
import { render, } from "@testing-library/react";

import ActivityScoresStudentOverview from '../activity_scores_student_overview'

const mockProps = {
  location: {}
}

describe('ActivityScoresStudentOverview', () => {
  test('it should render', () => {
    const { asFragment } = render(<ActivityScoresStudentOverview {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
