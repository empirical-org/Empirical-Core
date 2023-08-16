import * as React from 'react'

import { requestGet, requestPost } from '../../../modules/request';
import CanvasInstanceSchoolsSelector from './CanvasInstanceSchoolsSelector';
import { Input } from '../../Shared';

export const CANVAS_INTEGRATIONS_PATH = '/canvas_instances'
export const SCHOOLS_WITH_SUBSCRIPTIONS_PATH = '/subscriptions/school_admin_subscriptions'

type InputElement = React.ChangeEvent<HTMLInputElement>

// passedSchools for testing purposes
const CanvasIntegrationForm = ({ passedSchools = [] }) => {
  const [canvasIntegrations, setCanvasIntegrations] = React.useState([])
  const [clientId, setClientId] = React.useState('')
  const [clientSecret, setClientSecret] = React.useState('')
  const [instanceUrl, setInstanceUrl] = React.useState('')
  const [selectedSchoolIds, setSelectedSchoolIds] = React.useState([])
  const [schoolsWithSubscriptions, setSchoolsWithSubscriptions] = React.useState(passedSchools || [])
  const [showCanvasIntegrationForm, setShowCanvasIntegrationForm] = React.useState(false)

  const handleChangeInstanceUrl = (e: InputElement) => { setInstanceUrl(e.target.value) }
  const handleChangeClientId = (e: InputElement) => { setClientId(e.target.value) }
  const handleChangeClientSecret = (e: InputElement) => { setClientSecret(e.target.value) }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validInput) { return }

    setShowCanvasIntegrationForm(false)

    return requestPost(
      CANVAS_INTEGRATIONS_PATH,
      canvasIntegrationParams(),
      () => {
        clearCanvasIntegrationForm()
        getCanvasIntegrations()
      }
    )
  }

  const canvasIntegrationParams = () => (
    {
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
  )

  const clearCanvasIntegrationForm = () => {
    setClientId('')
    setClientSecret('')
    setInstanceUrl('')
    setSelectedSchoolIds([])
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
  React.useEffect(() => { getCanvasIntegrations() }, [])

  const getSchoolsWithSubscriptions = () => {
    requestGet(SCHOOLS_WITH_SUBSCRIPTIONS_PATH, (body) => {
      setSchoolsWithSubscriptions(body.schools)
    })
  }

  const getCanvasIntegrations = () => {
    requestGet(CANVAS_INTEGRATIONS_PATH, (body) => {
      setCanvasIntegrations(body.canvas_integrations)
    })
  }

  const validInput = (
    instanceUrl.length > 0
    && isValidURL(instanceUrl) && clientId.length > 0
    && clientSecret.length > 0
    && selectedSchoolIds.length > 0
  )

  const urlInput = () => (
    <Input
      className="form-input url"
      handleChange={handleChangeInstanceUrl}
      id="instance_url"
      label="Canvas Instance URL"
      placeholder=""
      type="url"
      value={instanceUrl}
    />
  )

  const clientIdInput = () => (
    <Input
      className="form-input password"
      handleChange={handleChangeClientId}
      id="client_id"
      label="Client ID"
      placeholder=""
      type="password"
      value={clientId}
    />
  )

  const clientSecretInput = () => (
    <Input
      className="form-input password"
      handleChange={handleChangeClientSecret}
      id="client_secret"
      label="Client Secret"
      placeholder=""
      type="password"
      value={clientSecret}
    />
  )

  const canvasInstanceSchoolsSelector = () => (
    <CanvasInstanceSchoolsSelector
      schools={schoolsWithSubscriptions}
      selectedSchoolIds={selectedSchoolIds}
      setSelectedSchoolIds={setSelectedSchoolIds}
    />
  )

  const submitButton = () => (
    <button
      className={`quill-button medium primary contained focus-on-light ${validInput ? '' : 'disabled'}`}
      disabled={!validInput}
      id='submit_canvas_integration'
      onClick={handleSubmit}
      type="submit"
    >
      Submit
    </button>
  )

  const cancelButton = () => (
    <button
      className="quill-button medium contained focus-on-light"
      id='cancel_create_canvas_integration'
      onClick={() => setShowCanvasIntegrationForm(false)}
      type="button"
    >
      Cancel
    </button>
  )

  const schoolIntegrationsList = (schoolNames) => (
    schoolNames.map((schoolName, schoolIndex) => (
      <div className="school" key={schoolIndex}>
        <img alt="" src="https://assets.quill.org/images/icons/school_icon_admin.svg" />
        <p>{schoolName}</p>
      </div>
    ))
  )

  const renderCanvasIntegrations = () => {
    if (!canvasIntegrations || canvasIntegrations.length === 0) { return null }

    return (
      <div>
        {canvasIntegrations.map((canvasIntegration, canvasIntegrationIndex) => (
          <div className="create-new-accounts-container">
            <section className="right-section" >
              <section className="content-section" style={{ gridColumn: 1 }}>
                <h4>{canvasIntegration.url}</h4>
                <br />
                <div className="schools-list" key={canvasIntegrationIndex}>
                  {schoolIntegrationsList(canvasIntegration.schoolNames)}
                </div>
              </section>
            </section>
            <br />
          </div>
        ))}
      </div >
    )
  }

  const renderCanvasIntegrationForm = () => (
    <form className='container' id='new_canvas_integration' style={{ marginTop: '20px' }}>
      <h4>New Canvas Integration</h4>
      <br />
      {urlInput()}
      {clientIdInput()}
      {clientSecretInput()}
      {canvasInstanceSchoolsSelector()}
      {submitButton()}
      {cancelButton()}
    </form>
  )

  const renderNewCanvasIntegrationButton = () => (
    <div style={{ marginTop: '20px' }}>
      <button
        className='quill-button medium primary contained focus-on-light'
        id='new_canvas_integration_button'
        onClick={() => setShowCanvasIntegrationForm(true)}
        type="button"
      >
        New Canvas Integration
      </button>
    </div>
  )

  return (
    <div>
      <h2>Canvas</h2>
      {renderCanvasIntegrations()}
      {!showCanvasIntegrationForm && renderNewCanvasIntegrationButton()}
      {showCanvasIntegrationForm && renderCanvasIntegrationForm()}
    </div>
  )
}

export default CanvasIntegrationForm
