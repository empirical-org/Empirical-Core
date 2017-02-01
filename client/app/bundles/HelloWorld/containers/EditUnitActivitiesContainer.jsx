import React from 'React'
import UnitStage1 from '../components/lesson_planner/create_unit/stage1/unit_stage1.jsx'


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

  updateActivities() {

  },

  render() {
    return <UnitStage1
                      unitName='placeholder'
                      selectedActivities={[...this.state.selectedActivities]}
                      errorMessage='placeholder'
                      showNameTheUnit={false}
                      toggleActivitySelection={this.toggleActivitySelection}
          />
  }
})
