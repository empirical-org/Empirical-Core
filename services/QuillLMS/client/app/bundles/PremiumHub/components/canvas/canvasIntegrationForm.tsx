import * as React from 'react'

import SchoolSelector from './schoolSelector'
import { School, CanvasInstance, } from './shared'

import { requestPost, requestPut, requestDelete, } from '../../../../modules/request';
import { Input, } from '../../../Shared/index'

type InputElement = React.ChangeEvent<HTMLInputElement>

interface CanvasIntegrationFormProps {
  schools: School[];
  success: () => void;
  existingIntegration?: CanvasInstance;
  close?: () => void;
}

export const CANVAS_INTEGRATIONS_PATH = '/canvas_instances'

const isValidURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    return ['http:', 'https:'].includes(parsedURL.protocol);
  } catch (error) {
    return false;
  }
}

const CanvasIntegrationForm = ({ schools, existingIntegration=null, close=null, success, }: CanvasIntegrationFormProps) => {
  const [clientId, setClientId] = React.useState(existingIntegration?.client_id || '')
  const [clientSecret, setClientSecret] = React.useState(existingIntegration?.client_secret || '')
  const [instanceUrl, setInstanceUrl] = React.useState(existingIntegration?.url || '')
  const [selectedSchoolIds, setSelectedSchoolIds] = React.useState(existingIntegration?.school_ids || [])

  function validInput() {
    return Boolean(
      instanceUrl.length
      && isValidURL(instanceUrl)
      && clientId.length
      && clientSecret.length
      && selectedSchoolIds.length
    )
  }

  function closeOrReset() {
    if (close) {
      close()
    } else {
      setClientId('')
      setClientSecret('')
      setInstanceUrl('')
      setSelectedSchoolIds([])
    }
  }

  function handleChangeInstanceUrl(e: InputElement) { setInstanceUrl(e.target.value) }
  function handleChangeClientId(e: InputElement) { setClientId(e.target.value) }
  function handleChangeClientSecret(e: InputElement) { setClientSecret(e.target.value) }

  function handleDelete() {
    return requestDelete(
      `${CANVAS_INTEGRATIONS_PATH}/${existingIntegration.id}`,
      {},
      () => {
        closeOrReset()
        success()
      }
    )
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!validInput()) { return }

    const params = {
      canvas_config: {
        client_id: clientId,
        client_secret: clientSecret
      },
      canvas_instance: {
        url: instanceUrl
      },
      canvas_instance_schools: {
        school_ids: selectedSchoolIds
      }
    }

    if (existingIntegration) {
      return requestPut(
        `${CANVAS_INTEGRATIONS_PATH}/${existingIntegration.id}`,
        params,
        () => {
          closeOrReset()
          success()
        }
      )
    }

    return requestPost(
      CANVAS_INTEGRATIONS_PATH,
      params,
      () => {
        closeOrReset()
        success()
      }
    )
  }

  let deleteButtonOrEmptySpan = <span />

  if (existingIntegration) {
    deleteButtonOrEmptySpan = (
      <button
        className="quill-button contained primary medium focus-on-light red"
        onClick={handleDelete}
        type="button"
      >
        Delete
      </button>
    )
  }

  const formName = `${existingIntegration ? 'Edit' : 'New'} Canvas Integration`

  return (
    <form aria-label={formName} className="canvas-integration-form" name={formName}>
      <h2>{formName}</h2>
      <Input
        handleChange={handleChangeInstanceUrl}
        id="canvas-instance-url"
        label="Canvas Instance URL"
        type="url"
        value={instanceUrl}
      />
      <Input
        handleChange={handleChangeClientId}
        id="client-id"
        label="Client ID"
        value={clientId}
      />
      <Input
        handleChange={handleChangeClientSecret}
        id="client-secret"
        label="Client Secret"
        value={clientSecret}
      />
      <SchoolSelector
        schools={schools}
        selectedSchoolIds={selectedSchoolIds}
        setSelectedSchoolIds={setSelectedSchoolIds}
      />
      <div className="button-wrapper">
        {deleteButtonOrEmptySpan}
        <div>
          <button
            className="quill-button medium outlined secondary focus-on-light"
            onClick={closeOrReset}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`quill-button medium primary contained focus-on-light ${validInput() ? '' : 'disabled'}`}
            disabled={!validInput()}
            onClick={handleSubmit}
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default CanvasIntegrationForm
