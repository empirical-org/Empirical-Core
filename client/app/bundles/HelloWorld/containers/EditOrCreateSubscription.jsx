import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import request from 'request';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';
import getAuthToken from '../components/modules/get_auth_token';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscription: this.props.subscription || this.props.current_subscription,
    };
    this.changeAccountType = this.changeAccountType.bind(this);
    this.changePaymentAmount = this.changePaymentAmount.bind(this);
    this.changePaymentMethod = this.changePaymentMethod.bind(this);
    this.changePurchaserEmail = this.changePurchaserEmail.bind(this);
    this.changeExpirationDate = this.changeExpirationDate.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changePurchaserId = this.changePurchaserId.bind(this);
    this.changePurchaserInfoToTeacherInfo = this.changePurchaserInfoToTeacherInfo.bind(this);
    this.changeRecurring = this.changeRecurring.bind(this);
    this.getMatchingUserFromSchoolsUsersById = this.getMatchingUserFromSchoolsUsersById.bind(this);
    this.getMatchingUserFromSchoolsUsersByEmail = this.getMatchingUserFromSchoolsUsersByEmail.bind(this);
    this.submit = this.submit.bind(this);
    this.submitConfirmation = this.submitConfirmation.bind(this);
  }

  changePurchaserInfoToTeacherInfo() {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.purchaser_id = this.props.user.id;
    newSub.purchaser_email = this.props.user.email;
    this.setState({ subscription: newSub, });
  }

  changePaymentMethod(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_method = e;
    this.setState({ subscription: newSub, });
  }

  changePaymentAmount(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_amount = e.target.value * 100;
    this.setState({ subscription: newSub, });
  }

  getMatchingUserFromSchoolsUsersById(newSub, e) {
    const matchingSchoolUser = this.props.schoolsUsers && this.props.schoolsUsers.find(u => u.id === e);
    if (matchingSchoolUser) {
      newSub.purchaser_email = matchingSchoolUser.email;
    }
  }

  getMatchingUserFromSchoolsUsersByEmail(newSub, e) {
    const matchingSchoolUser = this.props.schoolsUsers && this.props.schoolsUsers.find(u => u.email === e.target.value);
    if (matchingSchoolUser) {
      newSub.purchaser_id = matchingSchoolUser.id;
    }
  }

  changeAccountType(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  changePurchaserEmail(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.purchaser_email = e.target.value;
    this.getMatchingUserFromSchoolsUsersByEmail(newSub, e);
    this.setState({ subscription: newSub, });
  }

  changeExpirationDate(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.expiration = e;
    this.setState({ subscription: newSub, });
  }

  changeStartDate(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.start_date = e;
    this.setState({ subscription: newSub, });
  }

  changePurchaserId(e) {
    const newSub = Object.assign({}, this.state.subscription);
    this.getMatchingUserFromSchoolsUsersById(newSub, e.id);

    newSub.purchaser_id = e.id;
    this.setState({ subscription: newSub, });
  }

  purchaserFromSchool() {
    if (this.props.schoolsUsers && this.props.schoolsUsers.length > 1) {
      return (
        <div key={`purchaser-from-school ${this.state.subscription.purchaser_id}`}>
          <label>Purchaser From School</label>
          <ItemDropdown
            items={[{ name: 'None', id: '', }].concat(this.props.schoolsUsers)}
            callback={this.changePurchaserId}
            selectedItem={this.props.schoolsUsers.find(u => u.id === this.state.subscription.purchaser_id)}
          />
        </div>
      );
    }
  }

  changeRecurring() {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.recurring = !newSub.recurring;
    this.setState({ subscription: newSub, });
  }

  submitVars() {
    const varsObj = { data: { subscription: this.state.subscription, authenticity_token: getAuthToken(), }, urlString: `${process.env.DEFAULT_URL}/cms/subscriptions`, };
    if (this.props.view === 'edit') {
      varsObj.httpVerb = 'put';
      varsObj.urlString += `/${this.state.subscription.id}`;
    } else {
      // we are creating
      const schoolOrUser = this.props.schoolOrUser;
      varsObj.data.school_or_user = schoolOrUser;
      varsObj.data.school_or_user_id = this.props[schoolOrUser].id;
      varsObj.httpVerb = 'post';
    }
    return varsObj;
  }

  submitConfirmation() {
    if (this.props.school) {
      if (confirm("You know you are about to add/edit an entire school's subscription, right?")) {
        this.submit();
      } else {
        alert('submission canceled');
      }
    }
  }

  submit() {
    const submitVars = this.submitVars();
    const that = this;
    request[submitVars.httpVerb]({
      url: submitVars.urlString,
      json: submitVars.data,
    },
    (e, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        alert('Subscription was saved');
        if (this.props.view === 'new') {
          // switch to the edit view after submission
          window.location = window.location.href.replace('new', 'edit');
        }
      } else {
        alert('There was an error. Please try again and contact a dev if you continue to get this warning.');
      }
    });
  }

  recurringIfCreditCard() {
    if (this.state.subscription.payment_method === 'Credit Card') {
      return (
        <label>
                Recurring:
                <input
                  type="checkbox"
                  checked={this.state.subscription.recurring}
                  onChange={this.changeRecurring}
                />
        </label>);
    }
  }

  changeToPurchaserInfo() {
    if (this.props.user) {
      return <span onClick={this.changePurchaserInfoToTeacherInfo} className="green-text text-green">Same As Teacher Info</span>;
    }
  }

  render() {
    const schoolOrUser = this.props.school || this.props.user || null;
    const submitAction = this.props.school ? this.submitConfirmation : this.submit;
    return (
      <div className="cms-subscription">
        <h1>{this.props.view === 'edit' ? 'Edit' : 'New'} Subscription: {_.get(schoolOrUser, 'name')}</h1>
        <h2>Subscription Information</h2>
        <label>Premium Status</label>
        <ItemDropdown
          items={this.props.premiumTypes}
          callback={this.changeAccountType}
          selectedItem={this.state.subscription.account_type || ''}
        />
        <label>Created At:</label>
        <span>{this.props.subscription.created_at}</span>
        <h2>Payment Information</h2>
        <label>Payment Method</label>
        <ItemDropdown
          items={this.props.subscriptionPaymentMethods}
          callback={this.changePaymentMethod}
          selectedItem={this.state.subscription.payment_method || ''}
        />
        <label>Purchase Amount (dollar value as integer -- no decimal or symbol)</label>
        <input onChange={this.changePaymentAmount} type="text" value={this.state.subscription.payment_amount / 100} />
        <h2>Purchaser Information</h2>
        {this.purchaserFromSchool()}
        <label>Purchaser Email</label>
        <p>If the purchaser is not in the school and you see a school dropdown, select 'None' and put in the purchasers email.</p>
        <input type="text" value={this.state.subscription.purchaser_email} onChange={this.changePurchaserEmail} />
        <br />
        {this.changeToPurchaserInfo()}
        {this.recurringIfCreditCard()}
        <h2>Period {this.props.view === 'edit' ? <span className="warning text-red">-- These should not be edited without good reason!</span> : null}</h2>
        <label>Start Date</label>
        <p>
          If this is a Teacher Subscription and no subscription already exists, the start date is set to today. If the subscription is being renewed, the start date is the day the old subscription ends.
        </p>
        <DatePicker selected={this.state.subscription.start_date ? moment(this.state.subscription.start_date) : null} onChange={this.changeStartDate} />
        <label htmlFor="">End Date</label>
        <p>
          If this a school or users first paid subscription, the default end date is {this.props.promoExpiration}. This value just stated will update automatically depending on the time of year.
        </p>
        <DatePicker selected={this.state.subscription.expiration ? moment(this.state.subscription.expiration) : null} onChange={this.changeExpirationDate} />
        <div>
          <button className="q-button cta-button bg-quillgreen text-white" onClick={submitAction}>
            {this.props.view === 'new' ? 'New' : 'Update'} Subscription
          </button>
        </div>
      </div>);
  }
}
