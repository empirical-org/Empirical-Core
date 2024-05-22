import * as React from 'react'
import CanvasIntegrationModal from './canvasIntegrationModal'
import { School, CanvasInstance, } from './shared'

interface CanvasIntegrationInstanceProps {
  schools: School[];
  getCanvasIntegrations: () => void;
  canvasIntegration: CanvasInstance;
}

const CanvasIntegrationInstance = ({ schools, getCanvasIntegrations, canvasIntegration, }: CanvasIntegrationInstanceProps) => {
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

export default CanvasIntegrationInstance
