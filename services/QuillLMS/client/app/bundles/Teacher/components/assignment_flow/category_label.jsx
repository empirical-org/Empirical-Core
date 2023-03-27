import React from 'react';
import { Link } from 'react-router-dom';

export default class CategoryLabel extends React.Component {
  generateClassName = () => {
    return `category-label img-rounded ${this.props.extraClassName}`
  };

  getLink = () => {
    return this.props.nonAuthenticated
      ? `/activities/packs?category=${this.props.data.name.toLowerCase()}`
      : `/teachers/classrooms/assign_activities/featured-activity-packs?category=${this.props.data.name.toLowerCase()}`
  };

  render() {
    if (this.props.data.name) {
      const label = <div className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div>
      if (this.props.isLink) {
        return (
          <Link to={this.getLink()}>{label}</Link>
        )
      } else {
        return label
      }
    } else {
      return null
    }
  }
}
