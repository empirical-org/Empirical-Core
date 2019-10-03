import React from 'react'
import { Link } from 'react-router'

const manageUnitsHeader = () => (
  <div className='manage-units-header'>
    <h1>My Activity Packs</h1>
    <div className='header-content'>
      <p>Below you can see all of the activities that you have assigned to your students. To assign more activities, click on the button to the right.</p>
      <a href='/teachers/classrooms/assign_activities'><button className="button-green create-unit featured-button">Assign A New Activity</button></a>
    </div>
  </div>
)

export default manageUnitsHeader
