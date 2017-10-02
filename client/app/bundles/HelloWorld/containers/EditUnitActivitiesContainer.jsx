import React from 'react'
import UnitStage1 from '../components/lesson_planner/create_unit/stage1/unit_stage1.jsx'
import $ from 'jquery'



export default React.createClass({

  getInitialState() {
    return {selectedActivities: new Set()}
  },

  toggleActivitySelection(activity) {
    // TODO: this should just take an id as a param -- the reason that it is not
    // is because the original toggleActivitySelection fn is expecting an entire activity
    // object and we don't want to break the original yet
    const newState = Object.assign({},this.state);
    const activities = newState.selectedActivities
    activities.has(activity) ? activities.delete(activity) : activities.add(activity)
    this.setState(newState)
  },

  getActivityIds(){
    const ids = [];
    this.state.selectedActivities.forEach((act)=>ids.push({id: act.id, due_date: null}));
    return ids
  },

  updateActivities() {
    const that = this;
    $.ajax({
      type: 'PUT',
      url: `/teachers/units/${that.props.params.unitId}/update_activities`,
      data: {
        data: JSON.stringify({activities_data: that.getActivityIds()})
            },
      statusCode: {
        200: function(data) {
          window.location = '/teachers/classrooms/lesson_planner'
        },
        422: function(response) {
          that.setState({errors: response.responseJSON.errors,
          loading: false})
        }
      }
    })
  },

  render() {
    return (
      <div>
          <div className='container lesson_planner_main edit-assigned-activities-container'>
            <UnitStage1
                        unitName={this.props.params.unitName}
                        hideNameTheUnit={Boolean(true)}
                        selectedActivities={[...this.state.selectedActivities]}
                        errorMessage={this.state.errors}
                        editing={Boolean(true)}
                        updateActivities={this.updateActivities}
                        toggleActivitySelection={this.toggleActivitySelection}
            />
        </div>
      </div>
      )
  }
})
