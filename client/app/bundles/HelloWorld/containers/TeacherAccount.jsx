import React from 'react';
import SelectRole from '../components/accounts/edit/select_role';
import UserSelectRole from '../components/accounts/edit/user_accessible_select_role.jsx';
import SelectSubscription from '../components/accounts/subscriptions/select_subscription';
import StaticDisplaySubscription from '../components/accounts/subscriptions/static_display_subscription';
import SelectSchool from '../components/accounts/school/select_school';
import $ from 'jquery';
import LoadingSpinner from '../components/shared/loading_indicator.jsx';
import ButtonLoadingIndicator from '../components/shared/button_loading_indicator';

export default React.createClass({
  propTypes: {
    userType: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return ({
      id: this.props.teacherId,
      name: '',
      username: '',
      email: '',
      isSaving: false,
      selectedSchool: null,
      originalSelectedSchool: null,
      schoolOptions: [],
      schoolOptionsDoNotApply: false,
      role: 'teacher',
      password: null,
      loading: true,
      errors: {},
      subscription: {
        id: null,
        expiration: '2016-01-01',
        account_limit: null,
      },
    });
  },

  componentDidMount() {
    let url,
      data;
    if (this.props.userType == 'staff') {
      url = `/cms/users/${this.props.teacherId}/show_json`;
    } else {
      url = '/teachers/my_account_data';
    }
    $.ajax({ url, success: this.populateData, });
  },

  populateData(data) {
    let school,
      schoolData,
      originalSelectedSchoolId;
    school = data.school;
    if (school == null) {
      schoolData = null;
      originalSelectedSchoolId = null;
    } else {
      schoolData = {
        id: school.id,
        text: school.name,
        zipcode: school.zipcode,
      };
      originalSelectedSchoolId = school.id;
      this.requestSchools(school.zipcode);
			// couldnt get react to re-render the default value of zipcode based on state change so have to use the below
      $('input.zip-input').val(school.zipcode);
    }
    let subscription;
    if (data.subscription) {
      subscription = data.subscription;
    } else {
      subscription = {
        id: null,
        expiration: '2016-01-01',
        account_limit: null,
        account_type: 'none',
        subscriptionType: 'none',
      };
    }
    this.setState({
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
      googleId: data.google_id,
      signedUpWithGoogle: data.signed_up_with_google,
      selectedSchool: schoolData,
      originalSelectedSchoolId,
      schoolOptionsDoNotApply: (originalSelectedSchoolId == null),
      subscription,
      loading: false,
    });
  },

  updateName(event) {
    this.setState({ name: event.target.value, });
  },

  updateUsername(event) {
    this.setState({ username: event.target.value, });
  },

  updateEmail(event) {
    this.setState({ email: event.target.value, });
  },

  clickSave() {
    this.setState({ isSaving: true, });
    const data = {
      name: this.state.name,
      authenticity_token: $('meta[name=csrf-token]').attr('content'),
      email: this.state.email,
      role: this.state.role,
      password: this.state.password,
      school_id: ((this.state.selectedSchool == null)
				? null
				: this.state.selectedSchool.id),
      original_selected_school_id: this.state.originalSelectedSchoolId,
      school_options_do_not_apply: this.state.schoolOptionsDoNotApply,
    };
    let url;
    if (this.props.userType == 'staff') {
      url = `/cms/users/${this.props.teacherId}`;
    } else if (this.props.userType == 'teacher') {
      url = '/teachers/update_my_account';
    }
    $.ajax({ type: 'PUT', data, url, success: this.uponUpdateAttempt, });
  },

  uponUpdateAttempt(data) {
    this.setState({ isSaving: false, });
    if (data.errors == null) {
			// name may have been capitalized on back-end
      data.errors = {};
      if (this.props.userType == 'staff') {
        this.saveSubscription();
      } else if (this.state.role === 'student') {
        window.location = '/profile';
      }
    }
    this.setState({ errors: data.errors, });
  },

  saveSubscription() {
    if (this.state.subscription.account_type == 'none') {
      if (this.state.subscription.id != null) {
        this.destroySubscription();
      }
    } else if (this.state.subscription.account_type == 'paid' || 'trial' || 'free low-income' || 'free contributor') {
      if (this.state.subscription.id == null) {
        this.createSubscription();
      } else {
        this.updateSubscription();
      }
    }
  },
  createSubscription() {
    const sub = Object.assign({}, this.state.subscription);
    delete sub.subscriptionType;
    sub.user_id = this.props.teacherId;
    $.ajax({ type: 'POST', url: '/subscriptions', data: sub, success: alert('saved!'), });
  },

  updateSubscription() {
    $.ajax({
      type: 'PUT',
      url: `/subscriptions/${this.state.subscription.id}`,
      data: {
        expiration: this.state.subscription.expiration,
        account_limit: this.state.subscription.account_limit,
        account_type: this.state.subscription.account_type || this.state.account_type,
      },
      success: alert('saved!'),
    });
  },

  destroySubscription() {
    const that = this;
    $.ajax({
      type: 'DELETE',
			// not sure why, but strong params are blocking me from sending the
      data: {
        account_type: this.state.subscription.account_type,
      },
      url: `/subscriptions/${this.state.subscription.id}`,
    }).done(() => {
      const subscription = {
        id: null,
        account_limit: null,
        expiration: null,
      };
      that.setState({ subscription, });
    });
  },
  updateSubscriptionState(subscription) {
    this.setState({ subscription, });
  },
  updateSubscriptionType(type) {
    const new_sub = Object.assign({}, this.state.subscription);
    new_sub.account_type = type;
    new_sub.subscriptionType = type;
    this.setState({ subscription: new_sub, });
  },
  updateSchool(school) {
    this.setState({ selectedSchool: school, });
  },
  requestSchools(zip) {
    $.ajax({
      url: '/schools.json',
      data: {
        zipcode: zip,
      },
      success: this.populateSchools,
    });
  },
  populateSchools(data) {
    this.setState({ schoolOptions: data, });
  },
  attemptDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete this account?');
    if (confirmed) {
      $.ajax({
        type: 'POST',
        url: `/teachers/clear_data/${this.state.id}`,
        data: {
          id: this.props.teacherId,
        },
      }).done(() => {
        window.location.href = window.location.origin;
      });
    }
  },
  updateSchoolOptionsDoNotApply() {
    this.setState({ schoolOptionsDoNotApply: !this.state.schoolOptionsDoNotApply, }, () => this.updateSelectedSchool());
  },
  updateSelectedSchool() {
    if (this.state.schoolOptionsDoNotApply) {
      this.setState({
        selectedSchool: {
          id: 103341,
          zipcode: null,
          name: 'not listed',
        },
      });
    }
  },
  updatePassword(e) {
    this.setState({ password: e.target.value, });
  },

  updateRole(role) {
    this.setState({ role, });
  },

  saveButton() {
    return this.state.isSaving
		? <button className="button-grey"><ButtonLoadingIndicator /></button>
		: <button onClick={this.clickSave} className="button-green">Save Changes</button>;
  },

  renderEmail() {
    let inputField, message
    if (this.state.googleId || this.state.signedUpWithGoogle) {
      if (this.props.userType == 'staff') {
        inputField = <input className="inactive" ref="email" value={this.state.email} readOnly />
        message = <span>This is a Google Classroom user, so you need to unsync their account with Google in order to change their email. You can do that <a href={`${process.env.DEFAULT_URL}/teacher_fix/google_sync`}>here</a>.</span>
      } else {
        inputField = <input className="inactive" ref="email" value={this.state.email} readOnly />
        message = <span>Your email is locked because it is connected to Google Classroom. If you need to change it, please contact us at <a href="mailto:support@quill.org">support@quill.org</a>.</span>
      }
    } else {
      inputField = <input ref="email" onChange={this.updateEmail} value={this.state.email} />
      message = this.state.errors.email
    }
    return <div className="row">
      <div className="form-label">Email</div>
      <div className="form-input">
        {inputField}
      </div>
      <div className="error">
        {message}
      </div>
    </div>;
  },

  render() {
    if (this.state.loading) {
      return <LoadingSpinner />;
    }
    let selectRole, subscription;
    if (this.props.userType == 'staff') {
      selectRole = <SelectRole role={this.state.role} updateRole={this.updateRole} errors={this.state.errors.role} />;
      subscription = <SelectSubscription subscription={this.state.subscription} updateSubscriptionType={this.updateSubscriptionType} updateSubscriptionState={this.updateSubscriptionState} />;
    } else {
      subscription = <StaticDisplaySubscription subscription={this.state.subscription} />;
    }

    return (
      <div className="container" id="my-account">
        <h3>My Account</h3>
        <div className="row">
          <div className="form-label">
						Full Name
					</div>
          <div className="form-input">
            <input ref="name" onChange={this.updateName} value={this.state.name} />
          </div>
          <div className="error">
            {this.state.errors.name}
          </div>
        </div>

        {this.renderEmail()}


        <div className="row">
          <div className="form-label">
						Password
					</div>
          <div className="form-input">
            <input type="password" ref="password" onChange={this.updatePassword} placeholder="Input New Password" />
          </div>
          <div className="error">
            {this.state.errors.password}
          </div>
        </div>

        {selectRole}
        <SelectSchool errors={this.state.errors.school} selectedSchool={this.state.selectedSchool} schoolOptions={this.state.schoolOptions} requestSchools={this.requestSchools} updateSchool={this.updateSchool} />

        <div className="row school-checkbox">
          <div className="col-xs-1 no-pr">
            <input ref="schoolOptionsDoNotApply" onChange={this.updateSchoolOptionsDoNotApply} type="checkbox" checked={this.state.schoolOptionsDoNotApply} />
          </div>
          <div className="col-xs-6 no-pl form-label checkbox-label">
						My school is not listed.
					</div>
        </div>

        {subscription}

        <div className="row">
          <div className="col-xs-4">
            {this.saveButton()}
          </div>
        </div>

        <div className="row">
          <div onClick={this.attemptDeleteAccount} className="col-xs-2 delete-account">
						Delete Account
					</div>
        </div>

      </div>
    );
  },
});
