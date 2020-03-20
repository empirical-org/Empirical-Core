import React from 'react'
import MyActivitiesTabs from '../components/assignment_flow/my_activities_tabs.jsx'

export default class extends React.Component {
  render() {
    const tabs = this.props.location.pathname.includes('teachers') ? <MyActivitiesTabs pathname={this.props.location.pathname} /> : <span />
    return (
      <div>
        {tabs}
        {this.props.children}
      </div>)
   }
}
