import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import { schools, canvasIntegration, } from './data'

import CanvasIntegrationInstance from '../canvasIntegrationInstance'

const props = {
  schools,
  canvasIntegration,
  getCanvasIntegrations: jest.fn()
}

const setup = () => {
  render(<CanvasIntegrationInstance {...props} />)
  const user = userEvent.setup()

  return { user, }
}

describe('CanvasIntegrationInstance', () => {
  test('it should render', () => {
    const { asFragment } = render(<CanvasIntegrationInstance {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('clicking on the Edit button should open the edit form', async () => {
    const { user, } = setup()

    expect(screen.queryByRole('form', {name: /edit canvas integration/i})).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /edit$/i }))
    expect(screen.getByRole('form', {name: /edit canvas integration/i})).toBeTruthy()
  })
})
