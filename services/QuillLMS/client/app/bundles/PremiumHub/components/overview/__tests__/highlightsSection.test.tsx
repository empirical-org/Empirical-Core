import * as React from "react";
import { render, } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

import HighlightsSection from '../highlightsSection'

const props = {
  pusherChannel: null,
  schools: []
}

describe('HighlightsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><HighlightsSection {...props} /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});
