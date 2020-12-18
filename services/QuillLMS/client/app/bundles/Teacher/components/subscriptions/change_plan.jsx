import React from 'react';

export default class extends React.Component {
  handleChange = e => {
    this.props.changeRecurringStatus(Boolean(e.target.value));
  };

  render() {
    const { recurring, } = this.props
    return (
      <div className="change-plan">
        <div className="radio-group">
          <label className="radio-option">
            <input checked={recurring} name="recurring" onChange={this.handleChange} type="radio" value={true} /> {this.props.subscriptionType} Premium - ${this.props.price} Annual Subscription
          </label>
          <label className="radio-option">
            <input checked={!recurring} name="recurring" onChange={this.handleChange} type="radio" value={false} /> Quill Basic - Free
          </label>
        </div>
      </div>
    );
  }
}
