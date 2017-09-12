import React from 'react'
import ActivitySearchAndSelect from '../components/lesson_planner/create_unit/activity_search/activity_search_and_select'

export default class ActivityCategory extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedActivities: props.activities
    }

    this.toggleActivitySelection = this.toggleActivitySelection.bind(this)
    this.updateActivityOrder = this.updateActivityOrder.bind(this)
  }

  toggleActivitySelection(activity) {
    const newSelectedActivities = this.state.selectedActivities
    const activityIndex = newSelectedActivities.indexOf(a => a.id === e.id)
    if (activityIndex === -1) {
      const activityWithOrderNumber = Object.assign({}, activity)
      activityWithOrderNumber.order_number = newSelectedActivities.length
      newSelectedActivities.push(activityWithOrderNumber)
    } else {
      newSelectedActivities.splice(activityIndex, 1)
    }
    this.setState({selectedActivities: newSelectedActivities})
  }

  updateActivityOrder(sortInfo) {
    const originalOrderedActivities = this.state.selectedActivities
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newOrderedActivities = newOrder.map((key, i) => {
      const newActivity = originalOrderedActivities[key]
      newActivity.order_number = i
      return newActivity
    })
    this.setState({selectedActivities: newOrderedActivities})
  }

  render() {
    return(<div>
      <ActivitySearchAndSelect
        selectedActivities={this.state.selectedActivities}
        toggleActivitySelection={this.toggleActivitySelection}
        sortable={true}
        sortCallback={this.updateActivityOrder}
      />
      <button>Save Activities</button>
    </div>
  )
  }
}
