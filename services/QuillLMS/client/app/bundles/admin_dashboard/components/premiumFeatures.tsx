import * as React from 'react'

export const PremiumFeatures = ({ handleClick, trainingOptionsElement }) => {
  return(
    <section className="admin-features-container">
      <section className="features-list">
        <section className="feature">
          <img alt="black single line graph icon" src="https://assets.quill.org/images/icons/line-graph-icon.svg" />
          <h3>Admin Premium Reports</h3>
          <p>Access each classroom’s Quill Premium reports. Print and download progress on concepts and standards mastered.</p>
        </section>
        <section className="feature">
          <img alt="black outline of a pen" src="https://assets.quill.org/images/icons/vector-pen-icon.svg" />
          <h3>Teacher Access and Usage</h3>
          <p>Access each teacher’s accounts to assign activities and manage rosters. Use admin access to support co-teaching. Learn more below.</p>
          <button className="quill-button fun secondary outlined teacher-access-button" onClick={handleClick} type="button">View teacher access and usage</button>
        </section>
        <section className="feature">
          <img alt="black outline of a school" src="https://assets.quill.org/images/icons/school-outline-icon.svg" />
          <h3>School-wide Educator Support</h3>
          <p>Quill Premium provides provides a one-hour remote PD session and priority support.</p>
          {trainingOptionsElement}
        </section>
      </section>
    </section>
  )
}

export default PremiumFeatures
