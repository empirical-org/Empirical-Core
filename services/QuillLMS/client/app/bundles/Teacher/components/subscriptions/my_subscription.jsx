import _ from 'lodash';
import moment from 'moment';
import React from 'react';

export default class extends React.Component {

  button() {
    const accountTypes = this.props.accountTypes;
    const subType = _.get(this.props.subscription, 'account_type');
    let copy,
      url;
    if (!subType || accountTypes.trial.includes(subType)) {
      // then they are on trial or basic
      copy = 'Buy Premium';
      url = '/premium';
    } else {
      copy = 'View Subscription';
      url = '/premium';
    }
    return <a className="q-button text-white bg-orange" href={url}>{copy}</a>;
  }

  render() {
    const subType = _.get(this.props.subscription, 'account_type');
    const expiration = _.get(this.props.subscription, 'expiration');
    return (
      <span>
        <h3>My Subscription</h3>
        <div className="form-row">
          <div className="form-label">
              Account Status
          </div>
          <div className="form-input">
            <input className="inactive" disabled value={subType || 'Quill Basic'} />
            {this.button()}
          </div>
        </div>
        <div className="form-row">
          <div className="form-label">
              Valid Until
          </div>
          <div className="form-input">
            <input className="inactive" disabled value={expiration ? moment(expiration).format('MMMM Do, YYYY') : 'N/A'} />
          </div>
        </div>
        <a className="green-link" href="/subscriptions">Manage Subscriptions</a>
      </span>
    );
  }

}
