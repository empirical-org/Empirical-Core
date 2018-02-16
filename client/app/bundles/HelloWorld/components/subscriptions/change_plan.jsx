import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import request from 'request';
import moment from 'moment';
import UpdateStripeCard from '../modules/stripe/update_card.js';
import getAuthToken from '../modules/get_auth_token';
import LoadingIndicator from '../shared/loading_indicator.jsx';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = { height: '50px', width: '50px', };
    return (
      <div className="radio-buttons">
        here i am
        <button onClick={this.props.updateSubscription} />
        <div className="outer-circle" style={style}><div className="inner-circle" /></div>
      </div>
    );
  }
}
