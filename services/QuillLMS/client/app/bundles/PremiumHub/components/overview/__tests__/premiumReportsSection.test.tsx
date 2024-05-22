import * as React from "react";
import { render, } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

import PremiumReportsSection from '../premiumReportsSection'

describe('PremiumReportsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><PremiumReportsSection /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});
