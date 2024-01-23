import * as React from "react";
import { render, } from "@testing-library/react";

import ConceptsStudentsProgressReport from '../concepts_students_progress_report'

jest.mock('query-string', () => ({ stringifyUrl: jest.fn(() => { }) }));
jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('ConceptsStudentsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<ConceptsStudentsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
