import * as React from "react";
import { render, } from "@testing-library/react";

import PremiumReportsSection from '../premiumReportsSection'

describe('PremiumReportsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<PremiumReportsSection />);
    expect(asFragment()).toMatchSnapshot();
  });
});
