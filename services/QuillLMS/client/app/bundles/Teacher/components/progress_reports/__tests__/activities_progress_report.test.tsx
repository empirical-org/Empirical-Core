import * as React from "react";
import { render, } from "@testing-library/react";

jest.mock('query-string', () => ({ stringifyUrl: jest.fn(() => {}) }));

import ActivitiesProgressReport from '../activities_progress_report'

describe('ActivitiesProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<ActivitiesProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
