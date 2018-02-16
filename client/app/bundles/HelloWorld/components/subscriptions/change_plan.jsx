import React from 'react';
import { RadioGroup, RadioButton, ReversedRadioButton } from 'react-radio-buttons';
import Modal from 'react-bootstrap/lib/Modal';
import request from 'request';
import moment from 'moment';
import UpdateStripeCard from '../modules/stripe/update_card.js';
import getAuthToken from '../modules/get_auth_token';
import LoadingIndicator from '../shared/loading_indicator.jsx';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val) {
    this.props.updateRecurring(val);
  }

  render() {
    return (
      <div className="change-plan">
        <RadioGroup onChange={this.handleChange} vertical className="radio-group">
          <ReversedRadioButton padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} iconSize={20} value={Boolean(true)}>
            Teacher Premium - $80 Annaul Subscription
          </ReversedRadioButton>
          <ReversedRadioButton padding={'0'} pointColor={' #00c2a2'} rootColor={'#666'} iconSize={20} value={Boolean(false)}>
            Quill Basic - Free
          </ReversedRadioButton>
        </RadioGroup>
      </div>
    );
  }
}
