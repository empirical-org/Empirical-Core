import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default class extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClickFunction: PropTypes.func.isRequired
  };

  render() {
    const selected = this.props.selected ? 'selected' : ''
    return (
      <div className={`calendar-prefill-option ${selected}`} onClick={this.props.onClickFunction}>{this.props.title}</div>
    );
  }
}
