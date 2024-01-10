import * as React from "react";
import { render, } from "@testing-library/react";

import StandardsAllClassroomsProgressReport from '../standards_all_classrooms_progress_report'

jest.mock('query-string', () => ({ parse: jest.fn(() => ({ classroom_id: 'test-id' })) }));
jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('StandardsAllClassroomsProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<StandardsAllClassroomsProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
