import * as React from 'react'

import SchoolSelector from './schoolSelector'

import { requestGet, requestPost, requestPut, requestDelete, } from '../../../../modules/request';
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

const CanvasIntegration = ({ schools, getCanvasIntegrations, canvasIntegration, }) => {
  const [showEditModal, setShowEditModal] = React.useState(false)

  function openModal() { setShowEditModal(true) }
  function closeModal() { setShowEditModal(false) }

  function handleEditSubmission() {
    getCanvasIntegrations()
    closeModal()
  }

  return (
    <React.Fragment>
      {showEditModal && (
        <CanvasIntegrationModal
          close={closeModal}
          existingIntegration={canvasIntegration}
          schools={schools}
          success={handleEditSubmission}
        />
      )}
      <section className="canvas-integration-instance">
        <div className="section-header">
          <h3>{canvasIntegration.url}</h3>
          <button className="quill-button medium secondary outlined focus-on-light" onClick={openModal} type="button">Edit</button>
        </div>
        {
          canvasIntegration.school_names.map((schoolName, schoolIndex) => (
            <div className="school" key={schoolIndex}>
              <img alt="" src="https://assets.quill.org/images/pages/administrator/integrations/school.svg" />
              <span>{schoolName}</span>
            </div>
          ))
        }
      </section>
    </React.Fragment>
  )
}

const CanvasIntegrationModal = (props) => {
  return (
    <div className="modal-container custom-date-modal-container">
      <div className="modal-background" />
      <div className="canvas-integration-modal quill-modal modal-body">
        <CanvasIntegrationForm {...props} />
      </div>
    </div>
  )
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
            className={`quill-button medium primary contained focus-on-light ${validInput ? '' : 'disabled'}`}
            disabled={!validInput}
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

const CanvasIntegrationContainer = ({ passedSchools=[] }) => {
  const [loading, setLoading] = React.useState(true)
  const [canvasIntegrations, setCanvasIntegrations] = React.useState(null)
  const [schoolsWithSubscriptions, setSchoolsWithSubscriptions] = React.useState(passedSchools || null)
  const [showNewModal, setShowNewModal] = React.useState(false)

  function openModal() { setShowNewModal(true) }
  function closeModal() { setShowNewModal(false) }

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

  function handleNewCanvasInstanceSubmission() {
    getCanvasIntegrations()
    closeModal()
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

  let canvasIntegrationElements = canvasIntegrations.map(canvasIntegration => {
    return (
      <CanvasIntegration
        canvasIntegration={canvasIntegration}
        getCanvasIntegrations={getCanvasIntegrations}
        key={canvasIntegration.id}
        schools={schoolsWithSubscriptions}
      />
    )
  })

  return (
    <div className="container canvas-container">
      {showNewModal && (
        <CanvasIntegrationModal
          close={closeModal}
          schools={schoolsWithSubscriptions}
          success={handleNewCanvasInstanceSubmission}
        />
      )}
      {canvasIntegrationElements}
      <button
        className="quill-button contained medium primary focus-on-light add-new-canvas-integration-button"
        onClick={openModal}
        type="button"
      >
        Add New Canvas Integration
      </button>
    </div>
  )
}

export default CanvasIntegrationContainer
