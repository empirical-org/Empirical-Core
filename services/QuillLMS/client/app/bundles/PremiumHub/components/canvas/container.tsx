import * as React from 'react'

import CanvasIntegrationForm from './canvasIntegrationForm'
import CanvasIntegrationModal from './canvasIntegrationModal'
import CanvasIntegrationInstance from './canvasIntegrationInstance'

import CanvasInstructionsModal from '../../../Teacher/components/classrooms/canvas_modal'
import { requestGet, } from '../../../../modules/request';
import { Spinner, } from '../../../Shared/index'
import { FULL, baseIntegrationImgSrc, circleCheckImg } from '../../shared'
import IntegrationTip from '../integration_tip'

export const CANVAS_INTEGRATIONS_PATH = '/canvas_instances'
export const SCHOOLS_WITH_SUBSCRIPTIONS_PATH = '/subscriptions/school_admin_subscriptions'

const canvasIconSrc = `${baseIntegrationImgSrc}/canvas.svg`

const CanvasIntegrationContainer = ({ passedSchools, passedCanvasIntegrations, accessType, user, }) => {
  const [loading, setLoading] = React.useState(!(passedSchools && passedCanvasIntegrations))
  const [canvasIntegrations, setCanvasIntegrations] = React.useState(passedCanvasIntegrations || null)
  const [schoolsWithSubscriptions, setSchoolsWithSubscriptions] = React.useState(passedSchools || null)
  const [showNewModal, setShowNewModal] = React.useState(false)
  const [showCanvasInstructionsModal, setShowCanvasInstructionsModal] = React.useState(false)

  React.useEffect(() => {
    if (loading) {
      getSchoolsWithSubscriptions()
      getCanvasIntegrations()
    }
  }, [])

  React.useEffect(() => {
    if (schoolsWithSubscriptions && canvasIntegrations) {
      setLoading(false)
    }
  }, [schoolsWithSubscriptions, canvasIntegrations])

  function handleClickAddNewCanvasIntegration() {
    if (accessType === FULL) {
      openNewModal()
    } else {
      openGenericCanvasInstructionsModal()
    }
  }

  function openNewModal() { setShowNewModal(true) }
  function closeNewModal() { setShowNewModal(false) }

  function openGenericCanvasInstructionsModal() { setShowCanvasInstructionsModal(true) }
  function closeCanvasInstructionsModal() { setShowCanvasInstructionsModal(false) }

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
    closeNewModal()
  }

  if (accessType !== FULL && !user.school_linked_to_canvas) {
    return (
      <div className="container">
        <div className="integration-container">
          <img alt="" className="logo" src={canvasIconSrc} />
          <h1>Unlock Canvas with School or District Premium</h1>
          <p>Looking to streamline your school’s teaching process with Quill’s Canvas integration? Subscribe to School or District Premium to allow teachers at your school or district to:</p>
          <ul>
            <li>{circleCheckImg}Seamlessly import their Canvas rosters.</li>
            <li>{circleCheckImg}Automatically create and sync Canvas student accounts.</li>
            <li>{circleCheckImg}Access a host of other premium benefits, including priority technical support, enhanced reporting, and assistance from our professional learning team.</li>
          </ul>
          <a href="/premium" rel="noopener noreferrer" target="_blank">Explore premium</a>
          <a href="https://support.quill.org/en/articles/8500172-how-to-choose-your-rostering-integration" rel="noopener noreferrer" target="_blank">How to choose your integration</a>
          <a href="https://support.quill.org/en/articles/8337988-how-do-i-set-up-the-canvas-integration-for-my-school-district-for-canvas-quill-administrators" rel="noopener noreferrer" target="_blank">How to set up this integration</a>
          <IntegrationTip />
        </div>
      </div>
    )
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
          close={closeNewModal}
          schools={schoolsWithSubscriptions}
          success={handleNewCanvasInstanceSubmission}
        />
      )}
      {showCanvasInstructionsModal && (
        <CanvasInstructionsModal
          close={closeCanvasInstructionsModal}
          user={user}
        />
      )}
      {canvasIntegrationElements}
      <button
        className="quill-button contained medium primary focus-on-light add-new-canvas-integration-button"
        onClick={handleClickAddNewCanvasIntegration}
        type="button"
      >
        Add New Canvas Integration
      </button>
    </div>
  )
}

export default CanvasIntegrationContainer
