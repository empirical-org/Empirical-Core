import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscription: props.subscription,
      purchaserEmail: props.purchaserEmail,
    };
    this.changeAccountType = this.changeAccountType.bind(this);
    this.changePaymentAmount = this.changePaymentAmount.bind(this);
    this.changePurchaserEmail = this.changePurchaserEmail.bind(this);
    this.changeExpirationDate = this.changeExpirationDate.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changePurchaserId = this.changePurchaserId.bind(this);
    this.changePurchaserInfoToTeacherInfo = this.changePurchaserInfoToTeacherInfo.bind(this);
  }

  changeAccountType(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  changePurchaserInfoToTeacherInfo() {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.purchaser_id = this.props.user.id;
    this.setState({ subscription: newSub, purchaserEmail: this.props.user.email, });
  }

  handlePaymentMethodChange(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_method = e;
    this.setState({ subscription: newSub, });
  }

  changePaymentAmount(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.payment_method = e.target.value * 100;
    this.setState({ subscription: newSub, });
  }

  getMatchingUserFromSchoolsUsers(newSub) {
    const matchingSchoolUser = this.props.schoolsUsers && this.props.schoolsUsers.find(u => u.email === e.target.value);
    if (matchingSchoolUser) {
      newSub.purchaser_id = matchingSchoolUser.id;
    }
  }

  changePurchaserEmail(e) {
    const newSub = Object.assign({}, this.state.subscription);
    newSub.purchaser_email = e.target.value;
    this.getMatchingUserFromSchoolsUsers(newSub);
    this.setState({ subscription: newSub, purchaserEmail: e.target.value, });
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
    newSub.purchaser_id = e;
    this.setState({ subscription: newSub, });
  }

  purchaserFromSchool() {
    if (this.props.schoolsUsers) {
      return (
        <div>
          <label>Purchaser From School</label>
          <ItemDropdown
            items={this.props.schoolsUsers}
            callBack={this.changePurchaserId}
            selectedItem={this.state.subscription.purchaser_id || ''}
          />
        </div>
      );
    }
  }

  render() {
    const schoolOrUser = this.props.school || this.props.user;
    return (
      <div>
        <h1>Edit Subscription: {schoolOrUser.name}</h1>
        <h2>Subscription Information</h2>
        <label>Premium Status</label>
        <ItemDropdown
          items={this.props.userPremiumTypes}
          callback={this.changeAccountType}
          selectedItem={this.state.subscription.account_type || ''}
        />
        <label>Created At:</label>
        <span>{this.props.subscription.created_at}</span>
        <h2>Payment Information</h2>
        <label>Payment Method</label>
        <ItemDropdown
          items={this.props.subscriptionPaymentMethods}
          callback={this.handlePaymentMethodChange}
          selectedItem={this.state.subscription.payment_method || ''}
        />
        <label>Payment Amount (dollar value as integer -- no decimal or symbol)</label>
        <input onChange={this.changePaymentAmount} type="text" value={this.state.subscription.payment_amount / 100} />
        <h2>Purchaser Information</h2>
        <span onClick={this.changePurchaserInfoToTeacherInfo} className="green-text text-green">Same As Teacher Info</span>
        {this.purchaserFromSchool()}
        <label>Purchaser Email</label>
        <input type="text" value={this.state.purchaserEmail} onChange={this.changePurchaserEmail} />
        <h2>Period</h2>
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
      </div>);
  }
}
