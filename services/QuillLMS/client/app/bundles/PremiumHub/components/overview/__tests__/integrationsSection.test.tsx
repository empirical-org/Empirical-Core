import * as React from "react";
import { render, } from "@testing-library/react";

import IntegrationsSection from '../integrationsSection'

describe('IntegrationsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<IntegrationsSection />);
    expect(asFragment()).toMatchSnapshot();
  });
});
