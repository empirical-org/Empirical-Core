import * as React from 'react'

import { arrowPointingRightIcon, helpIcon } from '../../../Shared/index'

const collegeBoardQuillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/dashboard/logo-quill-collegeboard.svg`

const CollegeBoard = () => (
  <section className="college-board">
    <div className="top-section">
      <a className="focus-on-light help-icon" href="/teacher-center/writing-skills-survey-for-ap"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
      <img alt="College Board and Quill logos" src={collegeBoardQuillLogoSrc} />
    </div>
    <p>We partnered with the College Board to provide free activities for AP, Pre-AP, and SpringBoard courses.</p>
    <a className="focus-on-light see-all-activities" href="/assign/college-board">
      <span>See all activities</span>
      <img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} />
    </a>
  </section>
)

export default CollegeBoard
