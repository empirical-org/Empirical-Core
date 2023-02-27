import React from 'react';
import { SingleDatePicker } from 'react-dates'
import _ from 'lodash';
import { DataTable } from '../../Shared/index'
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';
import moment from 'moment';

import { requestPut, requestPost, } from '../../../modules/request/index'

export default class EditOrCreateSubscription extends React.Component {
  constructor(props) {
    super(props);

    const { schools, subscription, current_subscription, } = props

    const defaultSubscription = subscription || current_subscription

    if (!defaultSubscription.account_type) {
      defaultSubscription.account_type = 'Teacher Paid'
    }

    this.state = {
      subscription: defaultSubscription,
      firstFocused: false,
      secondFocused: false,
      schools
    }
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

  createdAt = () => {
    const { subscription } = this.state
    const { created_at } = subscription

    if (!created_at) { return }

    return (
      <React.Fragment>
        <label>Created At:</label>
        <span>{created_at}</span>
        <br />
      </React.Fragment>
    )
  }

  endDate = () => {
    const { promoExpiration } = this.props
    const { secondFocused, subscription } = this.state

    return (
      <React.Fragment>
        <label htmlFor="">End Date</label>
        <p>
          If this a school's first paid subscription, the default end date is {promoExpiration}.
          This value just stated will update automatically depending on the time of year.
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
      </React.Fragment>
    )
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

  handleChangeAccountType = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.account_type = e;
    this.setState({ subscription: newSub, });
  }

  handleChangePurchaserInfoToTeacherInfo = () => {
    const { user, } = this.props
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.purchaser_id = user.id;
    newSub.purchaser_email = user.email;
    this.setState({ subscription: newSub, });
  }

  handleStripeInvoiceIdChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.stripe_invoice_id = e.target.value;
    this.setState({ subscription: newSub, });
  }

  handlePurchaseOrderNumberChange = (e) => {
    const { subscription, } = this.state
    const newSub = Object.assign({}, subscription);
    newSub.purchase_order_number = e.target.value;
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

  handleSubmit = () => {
    const { view, } = this.props
    const submitVars = this.submitVars()
    const that = this

    submitVars.requestMethod(
      submitVars.urlString,
      submitVars.data,
      (body) => {
        alert('Subscription was saved');
        if (view === 'new') {
          // redirect back to the school or district details page
          window.location = window.location.href.replace('new_subscription', '')
        }
      },
      (body) => {
        alert('There was an error. Please try again and contact a dev if you continue to get this warning.')
      }
    )
  }

  isInvoice = () => {
    const { subscription } = this.state

    return (subscription.payment_method === "Invoice")
  }

  stripeInvoiceInput = () => {
    const { subscription } = this.state

    return (
      <React.Fragment>
        <label>Stripe Invoice ID (leave blank for non-Stripe invoices)</label>
        <input onChange={this.handleStripeInvoiceIdChange} type="text" value={subscription.stripe_invoice_id} />
        <label>Purchase Order Number (if provided by customer)</label>
        <input onChange={this.handlePurchaseOrderNumberChange} type="text" value={subscription.purchase_order_number} />
      </React.Fragment>
    )
  }

  paymentInformation = () => {
    const { subscriptionPaymentMethods  } = this.props
    const { subscription } = this.state
    const subscriptionPaymentOptions = subscriptionPaymentMethods.concat('N/A')

    return (
      <React.Fragment>
        <h2>Payment Information</h2>
        <label>Payment Method</label>
        <ItemDropdown
          callback={this.changePaymentMethod}
          className="subscription-dropdown"
          items={subscriptionPaymentOptions}
          selectedItem={subscription.payment_method || 'N/A'}
        />
        {this.isInvoice() && this.stripeInvoiceInput()}
        <label>Purchase Amount (dollar value as integer -- no decimal or symbol: $80.00 should be entered as 80) -- if you leave this blank and provide a valid Stripe Invoice ID, this will be set automatically after you save </label>
        <input onChange={this.handlePaymentAmountChange} type="text" value={subscription.payment_amount / 100 || ''} />
      </React.Fragment>
    )
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

  period = () => {
    const { view } = this.props

    return (
      <React.Fragment>
        <h2>Period {view === 'edit' ? <span className="warning text-red">-- These should not be edited without good reason!</span> : null}</h2>
        {this.startDate()}
        {this.endDate()}
      </React.Fragment>
    )
  }

  premiumStatus = () => {
    const { premiumTypes } = this.props
    const { subscription } = this.state

    return (
      <React.Fragment>
        <label>Premium Status</label>
        <ItemDropdown
          callback={this.handleChangeAccountType}
          className="subscription-dropdown"
          items={premiumTypes}
          selectedItem={subscription.account_type || ''}
        />
      </React.Fragment>
    )
  }

  purchaserInformation = () => {
    const { subscription } = this.state

    return (
      <React.Fragment>
        <h2>Purchaser Information</h2>
        {this.purchaserFromSchool()}
        <label>Purchaser Email -- if you leave this blank and provide a valid Stripe Invoice ID, this will be set automatically after you save</label>
        <input onChange={this.handlePurchaserEmailChange} type="text" value={subscription.purchaser_email} />
        <br />
        {this.changeToPurchaserInfo()}
      </React.Fragment>
    )
  }

  recurring = () => {
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

  schoolSubscriptions = () => {
    const { district, schools } = this.props
    const headers = [{width: '510px', name: 'School', attribute: 'name'}]

    if (!district || !schools || !schools.length) { return }

    return (
      <React.Fragment>
        <h2>School Subscriptions</h2>
        <DataTable
          checkAllRows={this.checkAllRows}
          checkRow={this.toggleRowCheck}
          headers={headers}
          rows={schools}
          showCheckboxes={true}
          uncheckAllRows={this.uncheckAllRows}
          uncheckRow={this.toggleRowCheck}
        />
      </React.Fragment>
    )
  }

  startDate = () => {
    const { firstFocused, subscription } = this.state

    return (
      <React.Fragment>
        <label>Start Date</label>
        <p>
          If this is a Teacher Subscription and no subscription already exists,
          the start date is set to today. If the subscription is being renewed,
          the start date is the day the old subscription ends.
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
      </React.Fragment>

    )
  }

  subscriptionInformation = () => {
    const { subscription } = this.state

    return (
      <React.Fragment>
        <h2>Subscription Information</h2>
        {this.premiumStatus()}
        {this.createdAt()}
      </React.Fragment>
    )
  }

  submitButton = () => {
    const { subscriberType, view } = this.props
    const submitAction = subscriberType === 'User' ? this.handleSubmit : this.submitConfirmation

    return (
      <div>
        <button className="q-button cta-button bg-quillgreen text-white" onClick={submitAction} type="submit">
          {view === 'new' ? 'New' : 'Update'} Subscription
        </button>
      </div>
    )
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
      this.handleSubmit()
    } else {
      alert('submission canceled')
    }
  }

  submitVars = () => {
    const { subscription, schools } = this.state
    const { view, subscriber, subscriberType } = this.props

    const varsObj = {
      data: {
        subscription: subscription,
        schools: schools,
      },
      urlString: `${process.env.DEFAULT_URL}/cms/subscriptions`
    }

    if (view === 'edit') {
      varsObj.requestMethod = requestPut;
      varsObj.urlString += `/${subscription.id}`;
    } else if (view == 'new') {
      varsObj.data.subscriber_id = subscriber.id
      varsObj.data.subscriber_type = subscriberType
      varsObj.requestMethod = requestPost
    }
    return varsObj
  }

  title = () => {
    const { subscriber, view } = this.props

    return <h1>{view === 'edit' ? 'Edit' : 'New'} Subscription: {_.get(subscriber, 'name')}</h1>
  }

  toggleRowCheck = (id) => {
    const { schools } = this.state
    const school = schools.find(school => school.id === id)
    school.checked = !school.checked
    this.setState({ schools })
  }

  checkAllRows = () => {
    const { schools } = this.state
    const newSchools = schools.map(school => {
      school.checked = true
      return school
    })
    this.setState({ schools: newSchools })
  }

  uncheckAllRows = () => {
    const { schools } = this.state
    const newSchools = schools.map(school => {
      school.checked = false
      return school
    })
    this.setState({ schools: newSchools })
  }

  render() {
    return (
      <div className="cms-subscription">
        {this.title()}
        {this.subscriptionInformation()}
        {this.schoolSubscriptions()}
        {this.paymentInformation()}
        {this.purchaserInformation()}
        {this.recurring()}
        {this.period()}
        {this.submitButton()}
      </div>
    )
  }
}
