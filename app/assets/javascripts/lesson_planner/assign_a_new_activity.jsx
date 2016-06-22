'use strict'

EC.AssignANewActivity = React.createClass({
  propTypes: {
    toggleTab: React.PropTypes.func.isRequired
  },

  minis: function(){
    return (
[ <EC.AssignmentTypeMini
      title={'Entry Diagnostic'}
        img={'....'}
    bodyText={'Find your students’ writing abilities through a 15 question diagnostic.'}
    directions={'use intermittently'}
    routeToGetQuantity={'...'}
    unit = {'diagnostic'}
    timeDuration={'~20 Min.'}/>]
  )
},

render: function(){
  return(
    <div id='assign-new-activity-page' className='text-center'>
    <h1>Choose which type of assignment you'd like to use:</h1>
    <div>{this.minis()}</div>
    </div>
  )
}
})
