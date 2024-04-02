import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";

import { schools, canvasIntegration, } from './data'

import CanvasIntegrationModal from '../canvasIntegrationModal'

const sharedProps = {
  schools,
  success: jest.fn(),
  close: jest.fn()
}

describe('CanvasIntegrationModal', () => {
  test('it should render when there is not an existing integration', () => {
    const { asFragment } = render(<CanvasIntegrationModal {...sharedProps} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render when there is an existing integration', () => {
    const { asFragment } = render(<CanvasIntegrationModal {...sharedProps} existingIntegration={canvasIntegration} />);
    expect(asFragment()).toMatchSnapshot();
  })

})
