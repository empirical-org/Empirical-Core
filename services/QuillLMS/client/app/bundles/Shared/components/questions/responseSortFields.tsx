import * as React from 'react';

class ResponseSortFields extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.stateSpecificClass = this.stateSpecificClass.bind(this)
    this.renderAscendingArrow = this.renderAscendingArrow.bind(this)
    this.renderSortField = this.renderSortField.bind(this)
  }

  stateSpecificClass(stateName: string) {
    if (this.props.sorting === stateName) {
      return ' is-active';
    }
  }

  renderAscendingArrow(stateName: string) {
    if (this.props.sorting === stateName) {
      return this.props.ascending ? ' ⬆' : ' ⬇';
    }
  }

  renderSortField(displayName: string, stateName: string) {
    return (
      <li className={this.stateSpecificClass(stateName)}>
        <a onClick={this.props.toggleResponseSort.bind(null, stateName)}>
          {displayName} {this.renderAscendingArrow(stateName)}
        </a>
      </li>
    );
  }

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
  }

}

export { ResponseSortFields };

