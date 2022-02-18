import _ from 'underscore'
import React from 'react'

export default class CmsIndexTableRow extends React.Component {
  edit = () => {
    this.props.actions.edit(this.props.data.resource);
  };

  delete = () => {
    let confirm = window.confirm('are you sure you want to delete ' + this.props.data.resource[this.identifier()] + '?');
    if (confirm) {
      this.props.actions.delete(this.props.data.resource);
    }
  };

  identifier = () => {
    return this.props.data.identifier || 'name'
  };

  activitiesLink = () => {
    if (this.props.resourceNameSingular === 'activity_classification') {
      return <div className='col-xs-4' key="activities" onClick={this.goToActivities}>activities</div>
    }
  };

  goToActivities = () => {
    window.location = `/cms/activity_classifications/${this.props.data.resource.id}/activities`
  };

  render() {
    let edit_and_delete;
    edit_and_delete = _.reduce(['edit', 'delete'], function (acc, ele) {
      if (this.props.actions[ele]) {
        let el = <div className='col-xs-4' key={ele} onClick={this[ele]}>{ele}</div>
        return _.chain(acc).push(el).value();
      } else {
        return acc
      }
    }, [], this);

    return (
      <tr>
        <td>
          {this.props.data.resource[this.identifier()]}
        </td>
        <td>
          <div className='row'>
            {this.activitiesLink()}
            {edit_and_delete}
          </div>
        </td>
      </tr>
    );
  }
}
