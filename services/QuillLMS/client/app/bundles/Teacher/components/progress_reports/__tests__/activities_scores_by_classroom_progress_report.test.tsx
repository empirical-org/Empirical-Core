import * as React from "react";
import { render, } from "@testing-library/react";

jest.mock('query-string', () => ({ stringifyUrl: jest.fn(() => { }) }));

import ActivitiesScoresByClassroomProgressReport from '../activities_scores_by_classroom_progress_report'

describe('ActivitiesScoresByClassroomProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<ActivitiesScoresByClassroomProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
