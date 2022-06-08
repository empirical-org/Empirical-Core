import React from 'react';
import { SingleDatePicker } from 'react-dates'
import _ from 'lodash';
import request from 'request';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';
import getAuthToken from '../components/modules/get_auth_token';
import moment from 'moment';

export default class EditOrCreateSubscription extends React.Component {
  constructor(props) {
    super(props);

    const { subscription, current_subscription, } = props

    const defaultSubscription = subscription || current_subscription

    if (!defaultSubscription.account_type) {
      defaultSubscription.account_type = 'Teacher Paid'
    }

    this.state = {
      subscription: defaultSubscription,
      firstFocused: false,
      secondFocused: false
    };
  }

  getMatchingUserFromSchoolsUsersByEmail = (newSub, e) => {
    const { schoolsUsers, } = this.props
    const matchingSchoolUser = schoolsUsers && schoolsUsers.find(u => u.email === e.target.value);
    if (matchingSchoolUser) {
      newSub.purchaser_id = matchingSchoolUser.id;
    }
  }

  getMatchingUserFromSchoolsUsersById = (newSub, e) => {
    const { schoolsUsers, } = this.props
    const matchingSchoolUser = schoolsUsers && schoolsUsers.find(u => u.id === e);
    if (matchingSchoolUser) {
      newSub.purchaser_email = matchingSchoolUser.email;
    }
  }

  changeAccountType = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  changePaymentMethod = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    const newPaymentMethod = e === 'N/A' ? null : e
    newSub.payment_method = newPaymentMethod;
    this.setState({ subscription: newSub, });
  }

  changePurchaserId = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    this.getMatchingUserFromSchoolsUsersById(newSub, e.id);

    newSub.purchaser_id = e.id;
    this.setState({ subscription: newSub, });
  }

  changeToPurchaserInfo = () => {
    const { user, } = this.props
    if (user) {
      return <span className="green-text text-green" onClick={this.handleChangePurchaserInfoToTeacherInfo}>Same As Teacher Info</span>;
    }
  }

  handleChangePurchaserInfoToTeacherInfo = () => {
    const { user, } = this.props
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.purchaser_id = user.id;
    newSub.purchaser_email = user.email;
    this.setState({ subscription: newSub, });
  }

  handleExpirationDateChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.expiration = e;
    this.setState({ subscription: newSub, });
  }

  handlePaymentAmountChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.payment_amount = e.target.value * 100;
    this.setState({ subscription: newSub, });
  }

  handlePurchaserEmailChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.purchaser_email = e.target.value;
    this.getMatchingUserFromSchoolsUsersByEmail(newSub, e);
    this.setState({ subscription: newSub, });
  }

  handleRecurringChange = () => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.recurring = !newSub.recurring;
    this.setState({ subscription: newSub, });
  }

  handleStartDateChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.start_date = e;
    this.setState({ subscription: newSub, });
  }

  purchaserFromSchool = () => {
    const { subscription, } = this.state
    const { schoolsUsers, } = this.props
    if (schoolsUsers && schoolsUsers.length > 1) {
      return (
        <div key={`purchaser-from-school ${subscription.purchaser_id}`}>
          <label>Purchaser From School</label>
          <ItemDropdown
            callback={this.changePurchaserId}
            className="subscription-dropdown"
            items={[{ name: 'None', id: '', }].concat(schoolsUsers)}
            selectedItem={schoolsUsers.find(u => u.id === subscription.purchaser_id)}
          />
        </div>
      );
    }
  }

  recurringIfCreditCard = () => {
    const { subscription, } = this.state

    if (subscription.payment_method === 'Credit Card') {
      return (
        <label>
          Recurring:
          <input
            checked={subscription.recurring}
            onChange={this.handleRecurringChange}
            type="checkbox"
          />
        </label>
      );
    }
  }

  submit = () => {
    const { view, } = this.props
    const submitVars = this.submitVars();
    const that = this;

    request[submitVars.httpVerb]({
      url: submitVars.urlString,
      json: submitVars.data,
    },
    (e, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        alert('Subscription was saved');
        if (view === 'new') {
          // switch to the edit view after submission
          window.location = window.location.href.replace('new', 'edit');
        }
      } else {
        alert('There was an error. Please try again and contact a dev if you continue to get this warning.');
      }
    });
  }

  submitConfirmation = () => {
    const { district, school } = this.props

    let subscriberType = ''

    if (district) {
      subscriberType = 'District'
    } else if (school) {
      subscriberType = 'School'
    }

    if (confirm(`You know you are about to add/edit an entire ${subscriberType} subscription, right?`)) {
      this.submit();
    } else {
      alert('submission canceled');
    }
  }

  submitVars = () => {
    const { subscription, } = this.state
    const { view, subscriber, subscriberType } = this.props

    const varsObj = {
      data: {
        subscription: subscription,
        authenticity_token: getAuthToken()
      },
      urlString: `${process.env.DEFAULT_URL}/cms/subscriptions`
    }

    if (view === 'edit') {
      varsObj.httpVerb = 'put';
      varsObj.urlString += `/${subscription.id}`;
    } else if (view == 'new') {
      varsObj.data.subscriber_id = subscriber.id
      varsObj.data.subscriber_type = subscriberType
      varsObj.httpVerb = 'post'
    }
    return varsObj
  }

  render() {
    const { subscriber, subscriberType, view, premiumTypes, subscriptionPaymentMethods, promoExpiration, } = this.props
    const { subscription, firstFocused, secondFocused } = this.state

    const submitAction = subscriberType === 'User' ? this.submit : this.submitConfirmation

    const subscriptionPaymentOptions = subscriptionPaymentMethods.concat('N/A')

    return (
      <div className="cms-subscription">
        <h1>{view === 'edit' ? 'Edit' : 'New'} Subscription: {_.get(subscriber, 'name')}</h1>
        <h2>Subscription Information</h2>
        <label>Premium Status</label>
        <ItemDropdown
          callback={this.changeAccountType}
          className="subscription-dropdown"
          items={premiumTypes}
          selectedItem={subscription.account_type || ''}
        />
        <label>Created At:</label>
        <span>{subscription.created_at}</span>
        <h2>Payment Information</h2>
        <label>Payment Method</label>
        <ItemDropdown
          callback={this.changePaymentMethod}
          className="subscription-dropdown"
          items={subscriptionPaymentOptions}
          selectedItem={subscription.payment_method || 'N/A'}
        />
        <label>Purchase Amount (dollar value as integer -- no decimal or symbol)</label>
        <input onChange={this.handlePaymentAmountChange} type="text" value={subscription.payment_amount / 100} />
        <h2>Purchaser Information</h2>
        {this.purchaserFromSchool()}
        <label>Purchaser Email</label>
        <p>If the purchaser is not in the school and you see a school dropdown, select &#39;None&#39; and put in the purchasers email.</p>
        <input onChange={this.handlePurchaserEmailChange} type="text" value={subscription.purchaser_email} />
        <br />
        {this.changeToPurchaserInfo()}
        {this.recurringIfCreditCard()}
        <h2>Period {view === 'edit' ? <span className="warning text-red">-- These should not be edited without good reason!</span> : null}</h2>
        <label>Start Date</label>
        <p>
          If this is a Teacher Subscription and no subscription already exists, the start date is set to today. If the subscription is being renewed, the start date is the day the old subscription ends.
        </p>
        <SingleDatePicker
          date={subscription.start_date ? moment(subscription.start_date) : null}
          focused={firstFocused}
          id="date-picker"
          inputIconPosition="after"
          navNext="›"
          navPrev="‹"
          numberOfMonths={1}
          onDateChange={this.handleStartDateChange}
          onFocusChange={() => this.setState({ firstFocused: !firstFocused })}
        />
        <label htmlFor="">End Date</label>
        <p>
          If this a school's first paid subscription, the default end date is {promoExpiration}. This value just stated will update automatically depending on the time of year.
        </p>
        <SingleDatePicker
          date={subscription.expiration ? moment(subscription.expiration) : null}
          focused={secondFocused}
          id="date-picker"
          inputIconPosition="after"
          navNext="›"
          navPrev="‹"
          numberOfMonths={1}
          onDateChange={this.handleExpirationDateChange}
          onFocusChange={() => this.setState({ secondFocused: !secondFocused })}
        />
        <div>
          <button className="q-button cta-button bg-quillgreen text-white" onClick={submitAction} type="submit">
            {view === 'new' ? 'New' : 'Update'} Subscription
          </button>
        </div>
      </div>
    );
  }
}
