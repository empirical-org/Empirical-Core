import React from 'react';
import moment from 'moment';

export default class DateRangeFilterOption extends React.Component {
  render() {
    const selected = this.props.selected ? 'selected' : ''
    return (
      <div className={`calendar-prefill-option ${selected}`} onClick={this.props.onClickFunction}>{this.props.title}</div>
    );
  }
}
