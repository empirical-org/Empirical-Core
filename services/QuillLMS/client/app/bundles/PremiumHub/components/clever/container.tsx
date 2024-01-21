import * as React from 'react'

import { FULL, baseIntegrationImgSrc, circleCheckImg } from '../../shared'
import IntegrationTip from '../integration_tip'

const cleverIconSrc = `${baseIntegrationImgSrc}/clever_logo.svg`

const CleverIntegrationContainer = ({ accessType, }) => {
  return (
    <div className="container">
      <div className="integration-container">
        <img alt="" className="logo" src={cleverIconSrc} />
        <h1>Streamline teaching with Clever</h1>
        <p>Make teaching at your school even more effective with our seamless Clever integration. With this integration, teachers at your school or district can:</p>
        <ul>
          <li>{circleCheckImg}Seamlessly import Clever rosters.</li>
          <li>{circleCheckImg}Automatically create and sync Clever student accounts.</li>
        </ul>
        <p>{accessType === FULL ? 'You can also access Clever Secure Sync as part of your subscription. This makes the integration even more powerful and easy to configure.' : 'You can also subscribe to School or District Premium to access Clever Secure Sync. This makes the integration even more powerful and easy to configure.'}</p>
        <div className="links">
          {accessType === FULL ? null : <a href="/premium" rel="noopener noreferrer" target="_blank">Explore premium</a>}
          <a href="https://support.quill.org/en/articles/8500172-how-to-choose-your-rostering-integration" rel="noopener noreferrer" target="_blank">How to choose your integration</a>
          <a href="https://support.quill.org/en/articles/8461682-how-do-i-set-up-clever-secure-sync-for-my-school-district-for-clever-quill-administrators" rel="noopener noreferrer" target="_blank">How to set up this integration</a>
        </div>
        <IntegrationTip />
      </div>
    </div>
  )

}

export default CleverIntegrationContainer
