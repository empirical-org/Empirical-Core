import React from 'react'

import { SortableList, } from '../../Shared/index'
import getAuthToken from '../components/modules/get_auth_token'
import { requestDelete, requestPut, } from '../../../modules/request/index'

export default class ActivityCategories extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activity_categories: props.activity_categories
    }
  }

  deleteActivityCategory(key) {
    const activityCategoryToDelete = this.state.activity_categories[key]
    requestDelete(
      `${process.env.DEFAULT_URL}/cms/activity_categories/${activityCategoryToDelete.id}`,
      null,
      (body) => {
        const newActivityCategories = this.state.activity_categories
        newActivityCategories.splice(key, 1)
        this.setState({activity_categories: newActivityCategories})
        alert('Your activity category has been deleted.')
      },
      (body) => {
        alert(`We could not delete this activity category. Here is the response: ${response}`)
      }
    )
  }

  saveActivityCategories = () => {
    const that = this
    requestPut(
      `${process.env.DEFAULT_URL}/cms/activity_categories/update_order_numbers`,
      {
        activity_categories: this.state.activity_categories,
        authenticity_token: getAuthToken()
      },
      (body) => {
        this.setState({activity_categories: body.activity_categories})
        alert('The updated classroom order has been saved.')
      },
      (body) => {
        alert(`We could not save the updated activity category order. Here is the error: ${body}`)
      }
    )
  };

  updateActivityCategoryOrder = sortInfo => {
    const originalOrderedActivityCategories = this.state.activity_categories
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedActivityCategories = newOrder.map((key, i) => {
      const newActivityCategory = originalOrderedActivityCategories[key]
      newActivityCategory.order_number = i
      return newActivityCategory
    })
    this.setState({activity_categories: newOrderedActivityCategories})
  };

  renderActivityCategory(name, key, id) {
    return (
      <div className="activity-category" key={key}>
        <span className="name">{name}</span>
        <span>
          <a className="show" href={`/cms/activity_categories/${id}`}>Show</a>
          <span className="delete" onClick={() => this.deleteActivityCategory(key)}>Delete</span>
        </span>
      </div>
    )
  }

  render() {
    // return <div>I am not the problem</div>
    const activityCategoryItems = this.state.activity_categories.map((ac, i) => this.renderActivityCategory(ac.name, i, ac.id))
    return (
      <div className="activity-categories">
        <SortableList data={activityCategoryItems} sortCallback={this.updateActivityCategoryOrder} />
        <button onClick={this.saveActivityCategories}>Save Activity Categories</button>
      </div>
    )
  }
}
