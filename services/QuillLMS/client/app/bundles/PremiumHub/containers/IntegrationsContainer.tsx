import React from 'react';

import CanvasIntegrationForm from '../components/CanvasIntegrationForm'

const IntegrationsContainer = () => {
  return(
    <div className='standards-reports-by-classroom progress-reports-2018'>
      <div className='meta-overview flex-row space-between'>
        <div className='header-and-info'>
          <CanvasIntegrationForm passedSchools={[]} />
        </div>
      </div>
    </div>
  )
}

export default IntegrationsContainer
