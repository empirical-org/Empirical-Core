import React from 'react';
import { Routes, Route, Navigate, NavLink, } from "react-router-dom-v5-compat";

import CanvasIntegrationContainer from '../components/canvas/container'
import GoogleIntegrationContainer from '../components/google/container'
import CleverIntegrationContainer from '../components/clever/container'

const IntegrationsContainer = (sharedProps) => {
  const { accessType } = sharedProps

  return (
    <div className='integrations-container white-background-accommodate-footer'>
      <header className="reports-header">
        <div className="container">
          <h1>Integrations</h1>
          <nav>
            <NavLink to='/teachers/premium_hub/integrations/canvas'>Canvas</NavLink>
            <NavLink to='/teachers/premium_hub/integrations/google'>Google Classroom</NavLink>
            <NavLink to='/teachers/premium_hub/integrations/clever'>Clever</NavLink>
          </nav>
        </div>
      </header>
      <Routes>
        <Route element={<GoogleIntegrationContainer accessType={accessType} />} path='/teachers/premium_hub/integrations/clever' />
        <Route element={<GoogleIntegrationContainer accessType={accessType} />} path='/teachers/premium_hub/integrations/google' />
        <Route element={<CanvasIntegrationContainer accessType={accessType} />} path='/teachers/premium_hub/integrations/canvas' />
        <Route element={<Navigate to="/teachers/premium_hub/integrations/canvas" />} path='/teachers/premium_hub/integrations' />
      </Routes>
    </div>
  )
}

export default IntegrationsContainer
