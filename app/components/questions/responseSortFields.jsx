import React from 'react';

export default React.createClass({
  stateSpecificClass(stateName) {
    if (this.props.sorting === stateName) {
      return ' is-active';
    }
  },

  renderAscendingArrow(stateName) {
    if (this.props.sorting === stateName) {
      return this.props.ascending ? ' ⬆' : ' ⬇';
    }
  },

  renderSortField(displayName, stateName) {
    return (
      <li className={this.stateSpecificClass(stateName)}>
        <a onClick={this.props.toggleResponseSort.bind(null, stateName)}>
          {displayName} {this.renderAscendingArrow(stateName)}
        </a>
      </li>
    );
  },

  render() {
    return (
      <ul>
        {this.renderSortField('Submissions', 'count')}
        {this.renderSortField('First Attempts', 'firstAttemptCount')}
        {this.renderSortField('Text', 'text')}
        {this.renderSortField('Created At', 'createdAt')}
        {this.renderSortField('Status', 'status')}
      </ul>
    );
  },

});
