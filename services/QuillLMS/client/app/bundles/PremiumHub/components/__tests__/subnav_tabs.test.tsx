import * as React from "react";
import { MemoryRouter } from 'react-router';
import { render } from "@testing-library/react";

import { AdminSubnav } from '../subnav_tabs'

const mockPath = {
  path: {
    pathname: ''
  }
}
describe('AdminSubnav', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><AdminSubnav path={mockPath} /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  })
})
