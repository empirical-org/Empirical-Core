import React from 'react'
import request from 'request'
import getAuthToken from '../components/modules/get_auth_token'
import CustomActivityPackPage from '../components/assignment_flow/create_unit/custom_activity_pack/index'

export default class ActivityCategory extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedActivities: props.activities
    }
  }

  destroyAndRecreateOrderNumbers = () => {
    const that = this
    const activities = this.state.selectedActivities;
    request.post(`${process.env.DEFAULT_URL}/cms/activity_categories/destroy_and_recreate_acas`, {
      json: {
        authenticity_token: getAuthToken(),
        activities: activities,
        activity_category_id: that.props.activity_category.id
      }}, (e, r, response) => {
      if (e) {
        alert(`We could not save the updated activity order. Here is the error: ${e}`)
      } else {
        this.setState({selectedActivities: response.activities})
        alert('The updated activity order has been saved.')
      }
    }
    )
  };

  toggleActivitySelection = activity => {
    const newSelectedActivities = this.state.selectedActivities
    const activityIndex = newSelectedActivities.findIndex(a => a.id === activity.id)
    if (activityIndex === -1) {
      const activityWithOrderNumber = Object.assign({}, activity)
      activityWithOrderNumber.order_number = newSelectedActivities.length
      newSelectedActivities.push(activityWithOrderNumber)
    } else {
      newSelectedActivities.splice(activityIndex, 1)
    }
    this.setState({selectedActivities: newSelectedActivities})
  };

  updateActivityOrder = newSelectedActivities => {
    const { selectedActivities, } = this.state
    const newOrder = newSelectedActivities.map(item => item.id);
    const newOrderedActivities = newOrder.map((key, i) => {
      const newActivity = selectedActivities.find(a => a.id === key)
      newActivity.order_number = i
      return newActivity
    })
    this.setState({selectedActivities: newOrderedActivities})
  };

  render() {
    return(
      <div>
        <CustomActivityPackPage
          clickContinue={this.destroyAndRecreateOrderNumbers}
          selectedActivities={this.state.selectedActivities}
          setSelectedActivities={this.updateActivityOrder}
          toggleActivitySelection={this.toggleActivitySelection}
        />
      </div>
    )
  }
}
