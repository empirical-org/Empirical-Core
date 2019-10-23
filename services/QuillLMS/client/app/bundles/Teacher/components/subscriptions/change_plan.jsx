import React from 'react';
import { RadioGroup, ReversedRadioButton } from 'react-radio-buttons';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val) {
    this.props.changeRecurringStatus(val);
  }

  render() {
    return (
      <div className="change-plan">
        <RadioGroup className="radio-group" onChange={this.handleChange} vertical>
          <ReversedRadioButton checked={this.props.recurring} iconSize={20} padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} value={Boolean(true)}>
            {this.props.subscriptionType} Premium - ${this.props.price} Annual Subscription
          </ReversedRadioButton>
          <ReversedRadioButton checked={!this.props.recurring} iconSize={20} padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} value={Boolean(false)}>
            Quill Basic - Free
          </ReversedRadioButton>
        </RadioGroup>
      </div>
    );
  }
}
