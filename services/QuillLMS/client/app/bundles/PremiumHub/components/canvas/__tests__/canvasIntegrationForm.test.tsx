import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/dom'

import { schools, canvasIntegration, } from './data'

import CanvasIntegrationForm, { CANVAS_INTEGRATIONS_PATH, } from '../canvasIntegrationForm'
import * as requestsApi from '../../../../../modules/request';

const success = jest.fn()

const sharedProps = {
  schools,
  success,
}

const instanceUrl = canvasIntegration.url
const clientId = canvasIntegration.client_id
const clientSecret = canvasIntegration.client_secret

function typeInInput(user, name, text) {
  return user.type(screen.getByRole('textbox', { name: name }), text)
}

function clearInput(user, name) {
  return user.clear(screen.getByRole('textbox', { name: name }))
}

function topLevelCheckbox(user) {
  const row = screen.getByRole('row', { name: /schools/i });
  return within(row).getByRole('button', { name: /checkbox/i })
}

function clickTopLevelCheckbox(user) {
  return user.click(topLevelCheckbox(user))
}

function clickSubmit(user) {
  return user.click(screen.getByRole('button', { name: /submit/i }))
}

function clickCancel(user) {
  return user.click(screen.getByRole('button', { name: /cancel/i }))
}

function clickDelete(user) {
  return user.click(screen.getByRole('button', { name: /delete/i }))
}

function getInputValue(user, name) {
  return screen.getByRole('textbox', { name: name }).value
}

describe('CanvasIntegrationForm', () => {

  describe('when there is an existing integration', () => {
    const requestPutSpy = jest.spyOn(requestsApi, 'requestPut').mockImplementation(() => { })
    const requestDeleteSpy = jest.spyOn(requestsApi, 'requestDelete').mockImplementation(() => { })

    const setup = () => {
      render(<CanvasIntegrationForm {...sharedProps} existingIntegration={canvasIntegration} />)
      const user = userEvent.setup()

      return { user, }
    }

    test('it should render', () => {
      const { asFragment } = render(<CanvasIntegrationForm {...sharedProps} existingIntegration={canvasIntegration} />);
      expect(asFragment()).toMatchSnapshot();
    })

    test('it should populate all input with the ones from the existing canvas integration', () => {
      const { user, } = setup()

      expect(getInputValue(user, /canvas instance url/i)).toBe(instanceUrl)
      expect(getInputValue(user, /client secret/i)).toBe(clientSecret)
      expect(getInputValue(user, /client id/i)).toBe(clientId)

      const row = screen.getByRole('row', { name: /schools/i });
      expect(within(row).getByRole('button', { name: /checked checkbox/i })).toBeTruthy()
    })

    it('calls close if cancel is clicked and there is a close prop', async () => {
      const close = jest.fn()
      render(<CanvasIntegrationForm {...sharedProps} close={close} existingIntegration={canvasIntegration} />)
      const user = userEvent.setup()

      await clickCancel(user)

      expect(close).toHaveBeenCalled()
    })

    it('calls requestDelete if delete is clicked', async () => {
      const { user, } = setup()

      await clickDelete(user)

      expect(requestDeleteSpy).toHaveBeenCalledWith(
        `${CANVAS_INTEGRATIONS_PATH}/${canvasIntegration.id}`,
        {},
        expect.any(Function)
      )
    })

    test('prevents submission if clientSecret is empty', async () => {
      const { user, } = setup()

      await clearInput(user, /client secret/i)
      await clickSubmit(user)

      expect(requestPutSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if clientId empty', async () => {
      const { user, } = setup()

      await clearInput(user, /client id/i)
      await clickSubmit(user)

      expect(requestPutSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if url is empty', async () => {
      const { user, } = setup()

      await clearInput(user, /canvas instance url/i)
      await clickSubmit(user)

      expect(requestPutSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if url is invalid', async () => {
      const { user, } = setup()

      await clearInput(user, /canvas instance url/i)
      await typeInInput(user, /canvas instance url/i, 'not-a-url')
      await clickSubmit(user)

      expect(requestPutSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if no school is selected', async () => {
      const { user, } = setup()

      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPutSpy).not.toHaveBeenCalled()
    })

    test('submits the form if input is valid', async () => {
      const { user, } = setup()

      await clickSubmit(user)

      expect(requestPutSpy).toHaveBeenCalledWith(
        `${CANVAS_INTEGRATIONS_PATH}/${canvasIntegration.id}`,
        {
          "canvas_config": {
            "client_id": clientId,
            "client_secret": clientSecret
          },
          "canvas_instance": {
            "url": instanceUrl
          },
          "canvas_instance_schools": {
            "school_ids": schools.map(s => s.id)
          }
        },
        expect.any(Function)
      )
    })

  })

  describe('when there is not an existing integration', () => {
    const requestPostSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => { })

    const setup = () => {
      render(<CanvasIntegrationForm {...sharedProps} />)
      const user = userEvent.setup()

      return { user, }
    }

    test('it should render', () => {
      const { asFragment } = render(<CanvasIntegrationForm {...sharedProps} />);
      expect(asFragment()).toMatchSnapshot();
    })

    test('it resets all the inputs if cancel is clicked and there is no close prop', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, instanceUrl)
      await typeInInput(user, /client secret/i, clientSecret)
      await typeInInput(user, /client id/i, clientId)
      await clickTopLevelCheckbox(user)

      await clickCancel(user)

      expect(getInputValue(user, /canvas instance url/i)).toBe('')
      expect(getInputValue(user, /client secret/i)).toBe('')
      expect(getInputValue(user, /client id/i)).toBe('')

      const row = screen.getByRole('row', { name: /schools/i });
      expect(within(row).getByRole('button', { name: /unchecked checkbox/i })).toBeTruthy()
    })

    it('calls close if cancel is clicked and there is a close prop', async () => {
      const close = jest.fn()
      render(<CanvasIntegrationForm {...sharedProps} close={close} />)
      const user = userEvent.setup()

      await clickCancel(user)

      expect(close).toHaveBeenCalled()
    })

    test('prevents submission if clientSecret is empty', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, instanceUrl)
      await typeInInput(user, /client id/i, clientId)
      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPostSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if clientId empty', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, instanceUrl)
      await typeInInput(user, /client secret/i, clientSecret)
      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPostSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if url is empty', async () => {
      const { user, } = setup()

      await typeInInput(user, /client id/i, clientId)
      await typeInInput(user, /client secret/i, clientSecret)
      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPostSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if url is invalid', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, 'not-a-url')
      await typeInInput(user, /client id/i, clientId)
      await typeInInput(user, /client secret/i, clientSecret)
      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPostSpy).not.toHaveBeenCalled()
    })

    test('prevents submission if no school is selected', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, instanceUrl)
      await typeInInput(user, /client id/i, clientId)
      await typeInInput(user, /client secret/i, clientSecret)
      await clickSubmit(user)

      expect(requestPostSpy).not.toHaveBeenCalled()
    })

    test('submits the form if input is valid', async () => {
      const { user, } = setup()

      await typeInInput(user, /canvas instance url/i, instanceUrl)
      await typeInInput(user, /client id/i, clientId)
      await typeInInput(user, /client secret/i, clientSecret)
      await clickTopLevelCheckbox(user)
      await clickSubmit(user)

      expect(requestPostSpy).toHaveBeenCalledWith(
        CANVAS_INTEGRATIONS_PATH,
        {
          "canvas_config": {
            "client_id": clientId,
            "client_secret": clientSecret
          },
          "canvas_instance": {
            "url": instanceUrl
          },
          "canvas_instance_schools": {
            "school_ids": schools.map(s => s.id)
          }
        },
        expect.any(Function)
      )
    })

  })

})
