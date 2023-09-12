import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import LoginForm from '../login_form'

const props = {
  cleverLink: "https://clever.com/oauth/authorize",
  expiredSessionRedirect: null,
  googleOfflineAccessExpired: null
}

describe('LoginForm', () => {
  test('it should render', () => {
    const { asFragment } = render(<LoginForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('typing in the email or username field should update the text of the field', async () => {
    render(<LoginForm {...props} />)
    const user = userEvent.setup()

    const typedText = 'anything'
    await user.type(screen.getByRole('textbox', { name: /email or username/i }), typedText)

    expect(screen.getByRole('textbox', { name: /email or username/i }).value).toBe(typedText)
  })

  test('typing in the password field should update the text of the field', async () => {
    render(<LoginForm {...props} />)
    const user = userEvent.setup()

    const typedText = 'anything'

    // passwords have no role, so must be found via label text (https://github.com/testing-library/dom-testing-library/issues/567)
    await user.type(screen.getByLabelText(/^password/i), typedText)

    expect(screen.getByLabelText(/^password/i).value).toBe(typedText)
  })

  test('clicking the eye icon should toggle the password visibility and change the name of the button', async () => {
    render(<LoginForm {...props} />)
    const user = userEvent.setup()

    expect(screen.getByLabelText(/^password/i).type).toBe('password')
    expect(screen.getByRole('button', { name: /show password/i })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(screen.getByLabelText(/^password/i).type).toBe('text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeTruthy()
  })

  test('clicking the checkbox should toggle the keep me signed in value', async () => {
    render(<LoginForm {...props} />)
    const user = userEvent.setup()

    expect(screen.getByRole('checkbox', { name: /keep me signed in/i })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: /keep me signed in/i }))
    expect(screen.getByRole('checkbox', { name: /keep me signed in/i })).not.toBeChecked()
  })

  test('the log in button should activate when both the email/username field and the password field have content', async () => {
    render(<LoginForm {...props} />)
    const user = userEvent.setup()

    expect(screen.getByRole('button', { name: /log in$/i })).toBeDisabled()

    const typedText = 'anything'
    await user.type(screen.getByRole('textbox', { name: /email or username/i }), typedText)
    await user.type(screen.getByLabelText(/^password/i), typedText)

    expect(screen.getByRole('button', { name: /log in$/i })).not.toBeDisabled()
  })
})
