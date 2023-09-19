import * as React from 'react'

import CanvasIntegrationForm from './canvasIntegrationForm'
import CanvasIntegrationModal from './canvasIntegrationModal'
import CanvasIntegrationInstance from './canvasIntegrationInstance'

import { requestGet, } from '../../../../modules/request';
import { Spinner, } from '../../../Shared/index'

export const CANVAS_INTEGRATIONS_PATH = '/canvas_instances'
export const SCHOOLS_WITH_SUBSCRIPTIONS_PATH = '/subscriptions/school_admin_subscriptions'

const CanvasIntegrationContainer = ({ passedSchools, passedCanvasIntegrations }) => {
  const [loading, setLoading] = React.useState(!(passedSchools && passedCanvasIntegrations))
  const [canvasIntegrations, setCanvasIntegrations] = React.useState(passedCanvasIntegrations || null)
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
      <CanvasIntegrationInstance
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
