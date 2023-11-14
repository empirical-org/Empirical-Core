import * as React from 'react'

import { baseIntegrationImgSrc, circleCheckImg } from '../../shared'
import IntegrationTip from '../integration_tip'

const googleIconSrc = `${baseIntegrationImgSrc}/google.svg`

const GoogleIntegrationContainer = () => {
  return (
    <div className="container">
      <div className="integration-container">
        <img alt="" className="logo" src={googleIconSrc} />
        <h1>Streamline teaching with Google Classroom</h1>
        <p>Make teaching at your school even more effective with our seamless Google Classroom integration. With this integration, teachers at your school or district can:</p>
        <ul>
          <li>{circleCheckImg}Seamlessly import Google Classroom rosters.</li>
          <li>{circleCheckImg}Automatically create and sync Google Classroom student accounts.</li>
          <li>{circleCheckImg}Share assignments directly to Google Classroom.</li>
        </ul>
        <a href="https://support.quill.org/en/articles/8500172-how-to-choose-your-rostering-integration" rel="noopener noreferrer" target="_blank">How to choose your integration</a>
        <a href="https://support.quill.org/en/articles/8470129-how-do-i-facilitate-the-google-classroom-integration-for-my-school-district" rel="noopener noreferrer" target="_blank">How to set up this integration</a>
        <IntegrationTip />
      </div>
    </div>
  )

}

export default GoogleIntegrationContainer
