import React from 'react'

import UnitStage1 from '../components/assignment_flow/create_unit/select_activities_container.jsx'
import { requestPut, } from '../../../modules/request/index'

export default class EditUnitActivitiesContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { selectedActivities: [] }
  }

  toggleActivitySelection = (activity) => {
    const activities = this.state.selectedActivities
    const newActivities = activities.find(act => act.id === activity.id) ? activities.filter(act => act.id !== activity.id) : activities.concat([activity])
    this.setState({ selectedActivities: newActivities, })
  };

  getActivityIds = () => {
    const ids = [];
    this.state.selectedActivities.forEach((act)=>ids.push({id: act.id, due_date: null}));
    return ids
  };

  updateActivities = () => {
    const that = this;
    requestPut(
      `${import.meta.env.DEFAULT_URL}/teachers/units/${that.props.match.params.unitId}/update_activities`,
      {
        data: { activities_data: that.getActivityIds(), }
      },
      (body) => {
        window.location = '/teachers/classrooms/lesson_planner'
      },
      (body) => {
        this.setState({ errors: body.errors, loading: false, })
      }
    )
  };

  render() {
    return (
      <div className="white-background-accommodate-footer">
        <UnitStage1
          editing={Boolean(true)}
          errorMessage={this.state.errors}
          hideNameTheUnit={Boolean(true)}
          selectedActivities={this.state.selectedActivities}
          toggleActivitySelection={this.toggleActivitySelection}
          unitName={this.props.match.params.unitName}
          updateActivities={this.updateActivities}
        />
      </div>
    )
  }
}
