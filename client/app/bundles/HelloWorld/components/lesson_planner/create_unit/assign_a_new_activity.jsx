'use strict'
import React from 'react'
import AssignmentTypeMini from './assignment_type_mini.jsx'
import LessonTypeMini from '../../shared/lesson_type_mini.jsx'

export default React.createClass({
  minis: function(){
    let minis =
      [
          <AssignmentTypeMini
            link='/teachers/classrooms/assign_activities/assign-a-diagnostic'
            key={'diagnostics'}
            title={'Entry Diagnostics'}
            img={`${process.env.CDN_URL}/images/shared/diagnostic_icon.svg`}
            bodyText={[<span key={1}>Find your students’ writing abilities with</span>, <br key={2}></br>, <span key={3}>a 22 question diagnostic.</span>]}
            directions={'use intermittently'}
            quantity={2}
            unit={'Diagnostic'}
            timeDuration={'~20 Min.'}
          />,
            <AssignmentTypeMini
              link='/teachers/classrooms/assign_activities/featured-activity-packs'
              key={'featured'}
              toggleTarget={'exploreActivityPacks'}
              title={'Featured Activity Packs'}
              img={`${process.env.CDN_URL}/images/shared/featured_activity_pack_icon.png`}
              bodyText={[<span key={1}>Quickly assign packs of activities created</span>, <br key={2}></br>, <span key={3}>by experienced educators.</span>]}
              directions={'use continuously'}
              routeToGetQuantity={'/count/featured_packs'}
              unit={'Pack'}
              timeDuration={'~1 Hour'}
            />,
            <AssignmentTypeMini
              link='/teachers/classrooms/assign_activities/create-unit'
              key={'custom'}
              toggleTarget={'createUnit'}
              title={'Explore All Activities'}
              img={`${process.env.CDN_URL}/images/shared/custom_activity_pack_icon.svg`}
              bodyText={'Browse our entire library of activities and create your own activity pack.'}
              directions={'use continuously'}
              routeToGetQuantity={'/count/activities'}
              unit={'Activity'}
              timeDuration={'~10 Min.'}
            />
        ]
      return minis
},

tools: function() {
  const userFlag = document.getElementById('current-user-testing-flag').getAttribute('content');
  return [
  <LessonTypeMini
    key={'diagnostic'}
    link='/teachers/classrooms/assign_activities/create-unit?tool=diagnostic'
    name='Quill Diagnostic'
    description='Identify Learning Gaps'
    imgSrc={`${process.env.CDN_URL}/images/icons/diagnostic-light-gray.svg`}
  />,
  <LessonTypeMini
    key={'lessons'}
    link='/teachers/classrooms/assign_activities/create-unit?tool=lessons'
    name='Quill Lessons'
    description='Lead Group Lessons'
    imgSrc={`${process.env.CDN_URL}/images/icons/lessons-light-gray.svg`}
  />,
  <LessonTypeMini
    key={'connect'}
    link='/teachers/classrooms/assign_activities/create-unit?tool=connect'
    name='Quill Connect'
    description='Combine Sentences'
    imgSrc={`${process.env.CDN_URL}/images/icons/connect-light-gray.svg`}
  />,
  <LessonTypeMini
    key={'grammmar'}
    link='/teachers/classrooms/assign_activities/create-unit?tool=sentence'
    name='Quill Grammar'
    description='Practice Basic Grammar'
    imgSrc={`${process.env.CDN_URL}/images/icons/grammar-light-gray.svg`}
  />,
  <LessonTypeMini
    key={'proofreader'}
    link='/teachers/classrooms/assign_activities/create-unit?tool=passage'
    name='Quill Proofreader'
    description='Find and Fix Errors in Passages'
    imgSrc={`${process.env.CDN_URL}/images/icons/proofreader-light-gray.svg`}
  />,
  <div key='superfluous element' style={{width: '300px', height: '0px'}}>
  </div>
  ]
},

render: function(){
  return(
    <div id='assign-new-activity-page' className='text-center'>
      <h1>Choose which type of assignment you'd like to use:</h1>
      <div className='minis'>{this.minis()}</div>
      <h1>Search all activities by tool:</h1>
      <div className="tools">{this.tools()}</div>
    </div>
  )
}
})
