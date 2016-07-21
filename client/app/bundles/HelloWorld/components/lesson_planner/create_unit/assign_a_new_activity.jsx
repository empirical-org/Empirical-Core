'use strict'
import React from 'react'
import AssignmentTypeMini from './assignment_type_mini.jsx'



export default React.createClass({
  propTypes: {
    toggleTab: React.PropTypes.func.isRequired
  },

  minis: function(){
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
    unit = {{singular: 'Pack', plural: 'Packs'}}
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
    unit = {{singular: 'Activity', plural: 'Activities'}}
    timeDuration={'~10 Min.'}/>,
]
  )
},

render: function(){
  return(
    <div id='assign-new-activity-page' className='text-center'>
      <h1>Choose which type of assignment you'd like to use:</h1>
    <div id='minis'>{this.minis()}</div>
    </div>
  )
}
})
