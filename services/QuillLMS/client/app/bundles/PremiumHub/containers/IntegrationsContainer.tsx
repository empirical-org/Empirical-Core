import React from 'react';

import CanvasIntegrationForm from '../components/CanvasIntegrationForm'

import { FULL } from '../shared';

const IntegrationsContainer = (sharedProps) => {
  const { accessType } = sharedProps

  const renderCanvasIntegrationForm = () => (
    accessType === FULL ? <CanvasIntegrationForm /> : <h1>Canvas Integration</h1>
  )

  return (
    <div className='standards-reports-by-classroom progress-reports-2018'>
      <div className='meta-overview flex-row space-between'>
        <div className='header-and-info'>
          {renderCanvasIntegrationForm()}
        </div>
      </div>
    </div>
  )
}

export default IntegrationsContainer
