'use strict'
import React from 'react'
import AssignmentTypeMini from './assignment_type_mini.jsx'
import LessonTypeMini from '../../shared/lesson_type_mini.jsx'

export default React.createClass({
  minis: function(){
    let minis =
      [
        <AssignmentTypeMini
          bodyText={[<span key={1}>Identify the skills each student needs to work on with one of our 4 diagnostics.</span>]}
          directions={'use intermittently'}
          img={`${process.env.CDN_URL}/images/shared/diagnostic_icon.svg`}
          key={'diagnostics'}
          link='/teachers/classrooms/assign_activities/assign-a-diagnostic'
          quantity={4}
          timeDuration={'~30 Min.'}
          title={'Entry Diagnostics'}
          unit={'Diagnostic'}
        />,
        <AssignmentTypeMini
          bodyText={[<span key={1}>Quickly assign packs of activities created</span>, <br key={2} />, <span key={3}>by experienced educators.</span>]}
          directions={'use continuously'}
          img={`${process.env.CDN_URL}/images/shared/featured_activity_pack_icon.png`}
          key={'featured'}
          link='/teachers/classrooms/assign_activities/featured-activity-packs'
          routeToGetQuantity={'/count/featured_packs'}
          timeDuration={'~1 Hour'}
          title={'Featured Activity Packs'}
          toggleTarget={'exploreActivityPacks'}
          unit={'Pack'}
        />,
        <AssignmentTypeMini
          bodyText={'Browse our entire library of activities and create your own activity pack.'}
          directions={'use continuously'}
          img={`${process.env.CDN_URL}/images/shared/custom_activity_pack_icon.svg`}
          key={'custom'}
          link='/teachers/classrooms/assign_activities/create-unit'
          routeToGetQuantity={'/count/activities'}
          timeDuration={'~10 Min.'}
          title={'Explore All Activities'}
          toggleTarget={'createUnit'}
          unit={'Activity'}
        />
        ]
      return minis
},

tools: function() {
  const userFlag = document.getElementById('current-user-testing-flag').getAttribute('content');
  return [
    <LessonTypeMini
      description='Identify Learning Gaps'
      imgSrc={`${process.env.CDN_URL}/images/icons/diagnostic-light-gray.svg`}
      key={'diagnostic'}
      link='/teachers/classrooms/assign_activities/create-unit?tool=diagnostic'
      name='Quill Diagnostic'
    />,
    <LessonTypeMini
      description='Lead Group Lessons'
      imgSrc={`${process.env.CDN_URL}/images/icons/lessons-light-gray.svg`}
      key={'lessons'}
      link='/teachers/classrooms/assign_activities/create-unit?tool=lessons'
      name='Quill Lessons'
    />,
    <LessonTypeMini
      description='Combine Sentences'
      imgSrc={`${process.env.CDN_URL}/images/icons/connect-light-gray.svg`}
      key={'connect'}
      link='/teachers/classrooms/assign_activities/create-unit?tool=connect'
      name='Quill Connect'
    />,
    <LessonTypeMini
      description='Practice Basic Grammar'
      imgSrc={`${process.env.CDN_URL}/images/icons/grammar-light-gray.svg`}
      key={'grammmar'}
      link='/teachers/classrooms/assign_activities/create-unit?tool=sentence'
      name='Quill Grammar'
    />,
    <LessonTypeMini
      description='Find and Fix Errors in Passages'
      imgSrc={`${process.env.CDN_URL}/images/icons/proofreader-light-gray.svg`}
      key={'proofreader'}
      link='/teachers/classrooms/assign_activities/create-unit?tool=passage'
      name='Quill Proofreader'
    />,
    <div key='superfluous element' style={{width: '300px', height: '0px'}} />
  ]
},

render: function(){
  return(
    <div className='text-center' id='assign-new-activity-page'>
      <h1>Choose which type of assignment you'd like to use:</h1>
      <div className='minis'>{this.minis()}</div>
      <h1>Search all activities by tool:</h1>
      <div className="tools">{this.tools()}</div>
    </div>
  )
}
})
