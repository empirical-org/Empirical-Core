import * as React from "react" ;
import { render, }  from "@testing-library/react";

import CleverIntegrationContainer from '../container'
import { FULL, RESTRICTED, } from '../../../shared'

describe('CleverIntegrationContainer', () => {

  describe('when access is restricted', () => {
    test('it should render', () => {
      const { asFragment } = render(<CleverIntegrationContainer accessType={RESTRICTED} />);
      expect(asFragment()).toMatchSnapshot();
    })
  })

  describe('when access is full', () => {
    test('it should render', () => {
      const { asFragment } = render(<CleverIntegrationContainer accessType={FULL} />);
      expect(asFragment()).toMatchSnapshot();
    })
  })

})
