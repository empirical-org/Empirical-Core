import React from 'react';
import { RadioGroup, ReversedRadioButton } from 'react-radio-buttons';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recurring: this.props.recurring,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val) {
    this.setState({ recurring: val, });
    this.props.updateRecurring(val);
  }

  render() {
    return (
      <div className="change-plan">
        <RadioGroup onChange={this.handleChange} vertical className="radio-group">
          <ReversedRadioButton checked={this.state.recurring} padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} iconSize={20} value={Boolean(true)}>
            Teacher Premium - $80 Annaul Subscription
          </ReversedRadioButton>
          <ReversedRadioButton checked={!this.state.recurring} padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} iconSize={20} value={Boolean(false)}>
            Quill Basic - Free
          </ReversedRadioButton>
        </RadioGroup>
      </div>
    );
  }
}
