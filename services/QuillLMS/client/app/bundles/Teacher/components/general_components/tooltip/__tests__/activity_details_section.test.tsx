import * as React from 'react';
import { render } from "@testing-library/react";

import ActivityDetailsSection from '../activity_details_section';

describe('ActivityDetailsSection component', () => {
  it('should render', () => {
    const { asFragment } = render(<ActivityDetailsSection description="This is a test description" header="Test Header" />);
    expect(asFragment()).toMatchSnapshot();
  })
});
