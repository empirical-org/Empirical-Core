import * as React from 'react'

import CanvasIntegrationForm from './canvasIntegrationForm'
import { School, CanvasInstance, } from './shared'

interface CanvasIntegrationModalProps {
  schools: School[];
  success: () => void;
  existingIntegration?: CanvasInstance;
  close?: () => void;
}

const CanvasIntegrationModal = (props: CanvasIntegrationModalProps) => {
  return (
    <div className="modal-container custom-date-modal-container">
      <div className="modal-background" />
      <div className="canvas-integration-modal quill-modal modal-body">
        <CanvasIntegrationForm {...props} />
      </div>
    </div>
  )
}

export default CanvasIntegrationModal
