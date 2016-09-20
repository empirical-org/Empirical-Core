'use strict'
import React from 'react'
import AssignmentTypeMini from './assignment_type_mini.jsx'



export default React.createClass({
  propTypes: {
    toggleTab: React.PropTypes.func.isRequired
  },

  minis: function(){
    if (this.props.flag === "beta") {
      return (
  [
      <AssignmentTypeMini
          key={1}
          toggleTab={this.props.toggleTab}
          toggleTarget={'exploreActivityPacks'}
        title={'Featured Activity Packs'}
          img={'/images/featured_activity_pack_icon.png'}
      bodyText={'Quickly assign packs of activities created by experienced educators.'}
      directions={'use continuously'}
      routeToGetQuantity={'/count/featured_packs'}
      unit={'Pack'}
      timeDuration={'~1 Hour'}/>,

      <AssignmentTypeMini
          key={2}
          toggleTab={this.props.toggleTab}
          toggleTarget={'createUnit'}
        title={'Custom Activity Packs'}
          img={'/images/custom_activity_pack_icon.svg'}
      bodyText={'Browse through our entire library of activities and create a custom sequence.'}
      directions={'use continuously'}
      routeToGetQuantity={'/count/activities'}
      unit={'Activity'}
      timeDuration={'~10 Min.'}/>,


    <a href='/diagnostic#/stage/1' >
      <AssignmentTypeMini
        key={3}
        toggleTab={this.props.toggleTab}
          title={'Entry Diagnostic'}
            img={'/images/diagnostic_icon.svg'}
        bodyText={'Find your students’ writing abilities through a 15 question diagnostic.'}
        directions={'use intermittently'}
        quantity={1}
        unit={'Diagnostic'}
        timeDuration={'~20 Min.'}/>
      </a>
  ]
    )
  } else {
    return (
[
    <AssignmentTypeMini
        key={1}
        toggleTab={this.props.toggleTab}
        toggleTarget={'exploreActivityPacks'}
      title={'Featured Activity Packs'}
        img={'/images/featured_activity_pack_icon.png'}
    bodyText={'Quickly assign packs of activities created by experienced educators.'}
    directions={'use continuously'}
    routeToGetQuantity={'/count/featured_packs'}
    unit={'Pack'}
    timeDuration={'~1 Hour'}/>,

    <AssignmentTypeMini
        key={2}
        toggleTab={this.props.toggleTab}
        toggleTarget={'createUnit'}
      title={'Custom Activity Packs'}
        img={'/images/custom_activity_pack_icon.svg'}
    bodyText={'Browse through our entire library of activities and create a custom sequence.'}
    directions={'use continuously'}
    routeToGetQuantity={'/count/activities'}
    unit={'Activity'}
    timeDuration={'~10 Min.'}/>
]
  )
  }

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
