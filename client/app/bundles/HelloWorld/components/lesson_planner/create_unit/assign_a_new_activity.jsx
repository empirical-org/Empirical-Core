'use strict'
import React from 'react'
import AssignmentTypeMini from './assignment_type_mini.jsx'

export default React.createClass({
  minis: function(){
    let minis =
      [
        <a href='/teachers/classrooms/assign_activities/assign-a-diagnostic'
            key={1}>
          <AssignmentTypeMini
            title={'Entry Diagnostics'}
            img={'/images/diagnostic_icon.svg'}
            bodyText={'Find your students’ writing abilities with a 22 question diagnostic.'}
            directions={'use intermittently'}
            quantity={2}
            unit={'Diagnostic'}
            timeDuration={'~20 Min.'}
            />
          </a>,
          <a key={2} href='/teachers/classrooms/assign_activities/featured-activity-packs'>
            <AssignmentTypeMini
              toggleTarget={'exploreActivityPacks'}
              title={'Featured Activity Packs'}
              img={'/images/featured_activity_pack_icon.png'}
              bodyText={'Quickly assign packs of activities created by experienced educators.'}
              directions={'use continuously'}
              routeToGetQuantity={'/count/featured_packs'}
              unit={'Pack'}
              timeDuration={'~1 Hour'}
            />
          </a>,
          <a key={3} href='/teachers/classrooms/assign_activities/create-unit'>
            <AssignmentTypeMini
              toggleTarget={'createUnit'}
              title={'Custom Activity Packs'}
              img={'/images/custom_activity_pack_icon.svg'}
              bodyText={'Browse through our entire library of activities and create a custom sequence.'}
              directions={'use continuously'}
              routeToGetQuantity={'/count/activities'}
              unit={'Activity'}
              timeDuration={'~10 Min.'}
            />
          </a>
        ]
      return minis
},

render: function(){
  return(
    <div id='assign-new-activity-page' className='text-center'>
      <h1>Choose which type of assignment you'd like to use:</h1>
      <div className='minis'>{this.minis()}</div>
    </div>
  )
}
})
