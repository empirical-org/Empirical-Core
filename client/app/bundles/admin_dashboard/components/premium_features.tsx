import * as React from 'react'

const PremiumFeatures = () =>
<div id="features">
  <h2>School dashboard</h2>
  <p>Quill Premium for Schools provides you with:</p>
  <div className="features-list">
    <div className="feature">
      <img src="https://assets.quill.org/images/icons/student_icon_admin.svg"/>
      <h3>Student Premium Reports</h3>
      <div className="dividing-line"></div>
      <p>Access each classroom’s Quill Premium reports. Print and download progress on concepts and standards mastered.</p>
    </div>
    <div className="feature">
      <img src="https://assets.quill.org/images/icons/teacher_icon_admin.svg"/>
      <h3>Teacher Account Access</h3>
      <div className="dividing-line"></div>
      <p>Access each teacher’s accounts to assign activities and manage rosters. Use admin access to support co-teaching. Learn more below.</p>
    </div>
    <div className="feature">
      <img src="https://assets.quill.org/images/icons/school_icon_admin.svg"/>
      <h3>School-wide Educator Support</h3>
      <div className="dividing-line"></div>
      <p>Quill Premium provides provides a one-hour remote PD session and priority support.</p>
      <div className="contact">
        <img src="https://assets.quill.org/images/headshots/thumb-becca.jpg" alt="becca thumb" />
        <div className="info">
          <p><a className="green-link" href="mailto:becca@quill.org">becca@quill.org</a></p>
          <p>646-442-1095</p>
        </div>
      </div>
    </div>
  </div>
  <a className="pd-session" href="http://beccaquill.youcanbook.me" target="_blank">
    <p><span>Have you set up your PD session?</span> <span>Schedule a call</span> with our school partnerships team to discuss your school’s needs and goals.</p>
    <img src="https://assets.quill.org/images/icons/chevron_admin.svg"/>
  </a>
</div>

export default PremiumFeatures
