import * as React from "react";
import { render, } from "@testing-library/react";

import HighlightsSection from '../highlightsSection'

const props = {
  pusherChannel: null,
  model: {
    schools: []
  }
}

describe('HighlightsSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<HighlightsSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
