import * as React from 'react'

import SchoolSelector from './schoolSelector'

import { requestGet, requestPost } from '../../../../modules/request';
import { Spinner, Input, } from '../../../Shared/index'

type InputElement = React.ChangeEvent<HTMLInputElement>

export const CANVAS_INTEGRATIONS_PATH = '/canvas_instances'
export const SCHOOLS_WITH_SUBSCRIPTIONS_PATH = '/subscriptions/school_admin_subscriptions'

const isValidURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    return ['http:', 'https:'].includes(parsedURL.protocol);
  } catch (error) {
    return false;
  }
}

const CanvasIntegrationForm = ({ schools, existingIntegration=null, close=null, success, }) => {
  const [clientId, setClientId] = React.useState(existingIntegration?.client_id || '')
  const [clientSecret, setClientSecret] = React.useState(existingIntegration?.client_secret || '')
  const [instanceUrl, setInstanceUrl] = React.useState(existingIntegration?.url || '')
  const [selectedSchoolIds, setSelectedSchoolIds] = React.useState(existingIntegration?.school_ids || [])

  const validInput = (
    instanceUrl.length
    && isValidURL(instanceUrl)
    && clientId.length
    && clientSecret.length
    && selectedSchoolIds.length
  )

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

  const handleChangeInstanceUrl = (e: InputElement) => { setInstanceUrl(e.target.value) }
  const handleChangeClientId = (e: InputElement) => { setClientId(e.target.value) }
  const handleChangeClientSecret = (e: InputElement) => { setClientSecret(e.target.value) }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validInput) { return }

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

    return requestPost(
      CANVAS_INTEGRATIONS_PATH,
      params,
      () => {
        closeOrReset()
        success()
      }
    )
  }

  return (
    <form className="canvas-integration-form">
      <h2>{existingIntegration ? 'Edit' : 'New'} Canvas Integration</h2>
      <Input
        handleChange={handleChangeInstanceUrl}
        label="Canvas Instance URL"
        type="url"
        value={instanceUrl}
      />
      <Input
        handleChange={handleChangeClientId}
        label="Client ID"
        value={clientId}
      />
      <Input
        handleChange={handleChangeClientSecret}
        label="Client Secret"
        value={clientSecret}
      />
      <SchoolSelector
        schools={schools}
        selectedSchoolIds={selectedSchoolIds}
        setSelectedSchoolIds={setSelectedSchoolIds}
      />
      <div className="button-wrapper">
        <button
          className="quill-button medium outlined secondary focus-on-light"
          onClick={closeOrReset}
          type="button"
        >
          Cancel
        </button>
        <button
          className={`quill-button medium primary contained focus-on-light ${validInput ? '' : 'disabled'}`}
          disabled={!validInput}
          onClick={handleSubmit}
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

const CanvasIntegrationContainer = ({ passedSchools=[] }) => {
  const [loading, setLoading] = React.useState(true)
  const [canvasIntegrations, setCanvasIntegrations] = React.useState(null)
  const [schoolsWithSubscriptions, setSchoolsWithSubscriptions] = React.useState(passedSchools || null)

  React.useEffect(() => {
    getSchoolsWithSubscriptions()
    getCanvasIntegrations()
  }, [])

  React.useEffect(() => {
    if (schoolsWithSubscriptions && canvasIntegrations) {
      setLoading(false)
    }
  }, [schoolsWithSubscriptions, canvasIntegrations])

  function getSchoolsWithSubscriptions() {
    requestGet(SCHOOLS_WITH_SUBSCRIPTIONS_PATH, (body) => {
      setSchoolsWithSubscriptions(body.schools)
    })
  }

  function getCanvasIntegrations() {
    requestGet(CANVAS_INTEGRATIONS_PATH, (body) => {
      setCanvasIntegrations(body.canvas_integrations)
    })
  }

  if (loading) {
    return (
      <div className="container">
        <Spinner />
      </div>
    )
  }

  if (!canvasIntegrations.length) {
    return (
      <div className="container canvas-container">
        <CanvasIntegrationForm schools={schoolsWithSubscriptions} success={getCanvasIntegrations} />
      </div>
    )
  }
}

export default CanvasIntegrationContainer
