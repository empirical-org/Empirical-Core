import * as React from "react";
import { render } from "@testing-library/react";

import ReportHeader from "../reportHeader";

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

const mockProps = {
  csvData: [],
  headerText: 'Test Header'
}

describe('ReportHeader', () => {
  test('it should render', () => {
    const { asFragment } = render(<ReportHeader {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
