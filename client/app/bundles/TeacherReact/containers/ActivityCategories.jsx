import React from 'react'
import SortableList from '../components/shared/sortableList'
import request from 'request'
import getAuthToken from '../components/modules/get_auth_token'

export default class ActivityCategories extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activity_categories: props.activity_categories
    }

    this.updateActivityCategoryOrder = this.updateActivityCategoryOrder.bind(this)
    this.saveActivityCategories = this.saveActivityCategories.bind(this)
  }

  updateActivityCategoryOrder(sortInfo) {
    const originalOrderedActivityCategories = this.state.activity_categories
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newOrderedActivityCategories = newOrder.map((key, i) => {
      const newActivityCategory = originalOrderedActivityCategories[key]
      newActivityCategory.order_number = i
      return newActivityCategory
    })
    this.setState({activity_categories: newOrderedActivityCategories})
  }

  saveActivityCategories() {
    console.log(getAuthToken())
    const that = this
    request.put(`${process.env.DEFAULT_URL}/cms/activity_categories/update_order_numbers`, {
      json: {
        activity_categories: this.state.activity_categories,
        authenticity_token: getAuthToken()
      }}, (e, r, response) => {
        if (e) {
          console.log(e)
          alert(`We could not save the updated activity category order. Here is the error: ${e}`)
        } else {
          this.setState({activity_categories: response.activity_categories})
          alert('The updated classroom order has been saved.')

        }
    })
  }

  deleteActivityCategory(key) {
    const activityCategoryToDelete = this.state.activity_categories[key]
    request.del(`${process.env.DEFAULT_URL}/cms/activity_categories/${activityCategoryToDelete.id}`, {
      json: {
        authenticity_token: getAuthToken()
      }}, (e, r, response) => {
      if (r.statusCode === 400) {
        console.log(e)
        alert(`We could not delete this activity category. Here is the response: ${response}`)
      } else {
        const newActivityCategories = this.state.activity_categories
        newActivityCategories.splice(key, 1)
        this.setState({activity_categories: newActivityCategories})
        alert('Your activity category has been deleted.')
      }
    })
  }

  renderActivityCategory(name, key, id) {
    return <div key={key} className="activity-category">
      <span className="name">{name}</span>
      <span>
        <a className="show" href={`/cms/activity_categories/${id}`}>Show</a>
        <span className="delete" onClick={() => this.deleteActivityCategory(key)}>Delete</span>
      </span>
    </div>
  }

  render() {
    // return <div>I am not the problem</div>
    const activityCategoryItems = this.state.activity_categories.map((ac, i) => this.renderActivityCategory(ac.name, i, ac.id))
    return <div className="activity-categories">
      <SortableList data={activityCategoryItems} sortCallback={this.updateActivityCategoryOrder} />
      <button onClick={this.saveActivityCategories}>Save Activity Categories</button>
    </div>
  }
}
