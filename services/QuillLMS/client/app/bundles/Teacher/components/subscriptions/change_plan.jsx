import React from 'react';

export default class ChangePlan extends React.Component {
  handleChange = e => {
    // So it turns out that `value={false}` below doesn't set the value to a boolean, but to the string "false" which, of course, evaluates as truth-y.  This meant that both checking the truthiness of the value itself is the same in both cases, and the buttons won't toggle.
    this.props.changeRecurringStatus(e.target.value !== 'false');
  };

  render() {
    const { recurring, } = this.props
    return (
      <div className="change-plan">
        <div className="radio-group">
          <label className="radio-option">
            <input
              checked={recurring}
              name="recurring"
              onChange={this.handleChange}
              type="radio"
              value={true}
            /> {this.props.subscriptionType} - ${this.props.price} Annual Subscription
          </label>
          <label className="radio-option">
            <input
              checked={!recurring}
              name="recurring"
              onChange={this.handleChange}
              type="radio"
              value={false}
            /> Quill Basic - Free
          </label>
        </div>
      </div>
    );
  }
}
