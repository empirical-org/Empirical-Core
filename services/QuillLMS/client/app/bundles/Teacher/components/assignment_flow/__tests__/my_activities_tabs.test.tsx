import * as React from "react";
import { MemoryRouter } from 'react-router';
import { render } from "@testing-library/react";

import { MyActivitiesTabs } from '../my_activities_tabs'

describe('MyActivitiesTabs', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><MyActivitiesTabs /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  })
})
