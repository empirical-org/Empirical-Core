import * as React from 'react'

const PremiumFeatures = ({ handleClick }) => {
  return(
    <section className="features">
      <section className="features-list">
        <section className="feature">
          <img alt="" src="https://assets.quill.org/images/icons/student_icon_admin.svg" />
          <h3>Admin Premium Reports</h3>
          <p>Access each classroom’s Quill Premium reports. Print and download progress on concepts and standards mastered.</p>
          <a className="quill-button fun secondary outlined admin-reports-button">View admin premium reports</a>
        </section>
        <section className="feature">
          <img alt="" src="https://assets.quill.org/images/icons/teacher_icon_admin.svg" />
          <h3>Teacher Access and Usage</h3>
          <p>Access each teacher’s accounts to assign activities and manage rosters. Use admin access to support co-teaching. Learn more below.</p>
          <button className="quill-button fun secondary outlined teacher-access-button" onClick={handleClick}>View teacher access and usage</button>
        </section>
        <section className="feature">
          <img alt="" src="https://assets.quill.org/images/icons/school_icon_admin.svg" />
          <h3>School-wide Educator Support</h3>
          <p>Quill Premium provides provides a one-hour remote PD session and priority support.</p>
          <a className="quill-button fun secondary outlined training-options-button" href="https://docsend.com/view/9r6gzp5v8w5ky6w9" rel="noopener noreferrer" target="_blank">View available training options</a>
        </section>
      </section>
    </section>
  )
}

export default PremiumFeatures
