import * as React from "react";
import { render } from "@testing-library/react";

import DataTableChip from "../dataTableChip";

const mockProps = {
  label: 'test label'
}

describe('DataTableChip', () => {
  test('it should render', () => {
    const { asFragment } = render(<DataTableChip {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
