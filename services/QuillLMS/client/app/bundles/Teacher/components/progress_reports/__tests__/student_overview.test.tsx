import * as React from "react";
import { render, } from "@testing-library/react";

import StudentOverview from '../student_overview'

describe('StudentOverview', () => {
  test('it should render', () => {
    const { asFragment } = render(<StudentOverview />);
    expect(asFragment()).toMatchSnapshot();
  });
});
