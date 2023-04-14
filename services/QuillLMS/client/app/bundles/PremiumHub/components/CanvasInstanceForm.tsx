import * as React from 'react'

import { requestGet, requestPost } from '../../../modules/request';
import CanvasInstanceSchoolsSection from './CanvasInstanceSchoolsSection';

export const CREATE_CANVAS_INSTANCE_PATH = "/canvas_instances"

type InputElement = React.ChangeEvent<HTMLInputElement>

const CanvasInstanceForm = () => {
  const [url, setUrl] = React.useState('')
  const [clientId, setClientId] = React.useState('')
  const [clientSecret, setClientSecret] = React.useState('')
  const [selectedSchoolIds, setSelectedSchoolIds] = React.useState([])
  const [schoolsWithSubscriptions, setSchoolsWithSubscriptions] = React.useState([])

  const handleChangeUrl = (e: InputElement) => { setUrl(e.target.value) }
  const handleChangeClientId = (e: InputElement) => { setClientId(e.target.value) }
  const handleChangeClientSecret = (e: InputElement) => { setClientSecret(e.target.value) }

  const handleSubmit = e => {
    e.preventDefault()

    return requestPost(CREATE_CANVAS_INSTANCE_PATH, {
      canvas_instance: {
        url: url
      },
      canvas_config: {
        client_id: clientId,
        client_secret: clientSecret
      },
      canvas_instance_schools: { school_ids: selectedSchoolIds }
    })
  }

  const isValidURL = (url: string): boolean => {
    try {
      const parsedURL = new URL(url);
      return ['http:', 'https:'].includes(parsedURL.protocol);
    } catch (error) {
      return false;
    }
  }

  React.useEffect(() => { getSchoolsWithSubscriptions() }, [])

  const getSchoolsWithSubscriptions = () => {
    requestGet('/subscriptions/school_admin_subscriptions', (body) => {
      setSchoolsWithSubscriptions(body.schools)
    })
  }

  const validInput = url.length > 0 && isValidURL(url) && clientId.length > 0 && clientSecret.length > 0

  const urlInput = (
    <div>
      <label>Url:</label>
      <input
        id='url'
        onChange={handleChangeUrl}
        type="text"
        value={url}
      />
    </div>
  )

  const clientIdInput = (
    <div>
      <label>Client ID:</label>
      <input
        id='client_id'
        onChange={handleChangeClientId}
        type="text"
        value={clientId}
      />
    </div>
  )

  const clientSecretInput = (
    <div>
      <label>Client Secret:</label>
      <input
        id='client_secret'
        onChange={handleChangeClientSecret}
        type="password"
        value={clientSecret}
      />
    </div>
  )

  const canvasSchoolInstancesInput = (
    <div>
      <label>Schools to integrate with Canvas</label>
      <CanvasInstanceSchoolsSection
        schools={schoolsWithSubscriptions}
        selectedSchoolIds={selectedSchoolIds}
        setSelectedSchoolIds={setSelectedSchoolIds}
      />
    </div>
  )

  const submitButton = validInput ? (
    <button
      className="quill-button medium primary contained focus-on-light"
      id='submit_canvas_instance'
      onClick={handleSubmit}
      type="button"
    >
      Submit
    </button>
  ) : (
    <button
      className="quill-button medium primary contained focus-on-light disabled"
      disabled
      type="button"
    >
        Submit
    </button>
  )

  return (
    <div id='canvas_instance_form'>
      <h2>Canvas Instance Form</h2>
      {urlInput}
      {clientIdInput}
      {clientSecretInput}
      {canvasSchoolInstancesInput}
      {submitButton}
    </div>
  )
}

export default CanvasInstanceForm;
