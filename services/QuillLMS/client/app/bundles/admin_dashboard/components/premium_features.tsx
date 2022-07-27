import * as React from 'react'

const PremiumFeatures = () =>
  (<div id="features">
    <div className="features-list">
      <div className="feature">
        <img alt="" src="https://assets.quill.org/images/icons/student_icon_admin.svg" />
        <h3>Student Premium Reports</h3>
        <div className="dividing-line" />
        <p>Access each classroom’s Quill Premium reports. Print and download progress on concepts and standards mastered.</p>
      </div>
      <div className="feature">
        <img alt="" src="https://assets.quill.org/images/icons/teacher_icon_admin.svg" />
        <h3>Teacher Account Access</h3>
        <div className="dividing-line" />
        <p>Access each teacher’s accounts to assign activities and manage rosters. Use admin access to support co-teaching. Learn more below.</p>
      </div>
      <div className="feature">
        <img alt="" src="https://assets.quill.org/images/icons/school_icon_admin.svg" />
        <h3>School-wide Educator Support</h3>
        <div className="dividing-line" />
        <p>Quill Premium provides provides a one-hour remote PD session and priority support.</p>
      </div>
    </div>
  </div>)

export default PremiumFeatures
