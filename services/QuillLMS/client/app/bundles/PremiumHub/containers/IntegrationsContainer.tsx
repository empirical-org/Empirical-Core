import React from 'react';
import { Routes, Route } from "react-router-dom-v5-compat";

import CanvasIntegrationContainer from '../components/canvas/container'

const IntegrationsContainer = (sharedProps) => {
  const { accessType } = sharedProps

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
      <Routes>
        <Route element={<CanvasIntegrationContainer accessType={accessType} />} path='/teachers/premium_hub/integrations/canvas' />
      </Routes>
    </div>
  )
}

export default IntegrationsContainer
