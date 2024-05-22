import * as React from "react" ;
import { render, }  from "@testing-library/react";

import GoogleIntegrationContainer from '../container'

describe('GoogleIntegrationContainer', () => {

  test('it should render', () => {
    const { asFragment } = render(<GoogleIntegrationContainer />);
    expect(asFragment()).toMatchSnapshot();
  })

})
