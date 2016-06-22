'use strict'

EC.AssignANewActivity = React.createClass({
  propTypes: {
    toggleTab: React.PropTypes.func.isRequired
  },

  minis: function(){
    return (
[ <EC.AssignmentTypeMini
      title={'Entry Diagnostic'}
        img={'/images/diagnostic_icon.svg'}
    bodyText={'Find your students’ writing abilities through a 15 question diagnostic.'}
    directions={'use intermittently'}
    routeToGetQuantity={'...'}
    unit = {{singular: 'Diagnostic', plural: 'Diagnostics'}}
    timeDuration={'~20 Min.'}/>,

    <EC.AssignmentTypeMini
      title={'Featured Activity Packs'}
        img={'/images/featured_activity_pack_icon.png'}
    bodyText={'Quickly assign packs of activities created by experienced educators.'}
    directions={'use continuosly'}
    routeToGetQuantity={'/count/featured_packs'}
    unit = {{singular: 'Pack', plural: 'Packs'}}
    timeDuration={'~1 Hour'}/>,

    <EC.AssignmentTypeMini
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
