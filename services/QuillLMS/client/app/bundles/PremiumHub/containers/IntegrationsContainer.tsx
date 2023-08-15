import React from 'react';

import CanvasInstanceForm from '../components/CanvasInstanceForm'

const IntegrationsContainer = () => {
  return(
    <div className='standards-reports-by-classroom progress-reports-2018'>
      <div className='meta-overview flex-row space-between'>
        <div className='header-and-info'>
          <CanvasInstanceForm passedSchools={[]} />
        </div>
      </div>
    </div>
  )
}

export default IntegrationsContainer
