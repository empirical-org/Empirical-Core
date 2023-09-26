import React from 'react';

import CanvasIntegrationContainer from '../components/canvas/container'
import { FULL, restrictedPage } from '../shared';

const IntegrationsContainer = (sharedProps) => {
  const { accessType } = sharedProps

  const renderContent = () => (
    accessType === FULL ? <CanvasIntegrationContainer /> : restrictedPage
  )

  return (
    <div className='integrations-container white-background-accommodate-footer'>
      <header className="reports-header">
        <div className="container">
          <h1>Integrations</h1>
          <nav>
            <button className="active" type="button">Canvas</button>
          </nav>
        </div>
      </header>
      {renderContent()}
    </div>
  )
}

export default IntegrationsContainer
