import * as React from "react";
import { render, } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

import IntegrationsSection from '../integrationsSection'

describe('IntegrationsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><IntegrationsSection /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});
