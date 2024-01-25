import * as React from "react";
import { render, } from "@testing-library/react";

import CSVDownloadForProgressReport from '../csv_download_for_progress_report'

jest.mock('../../../../Teacher/components/modules/user_is_premium', () => jest.fn());

describe('CSVDownloadForProgressReport', () => {
  test('it should render', () => {
    const { asFragment } = render(<CSVDownloadForProgressReport />);
    expect(asFragment()).toMatchSnapshot();
  });
});
