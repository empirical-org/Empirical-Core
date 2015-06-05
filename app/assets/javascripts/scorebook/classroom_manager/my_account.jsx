'use strict';
console.log('hi from my account')
$(function () {
  var ele = $('#my-account');
  if (ele.length > 0) {
    React.render(React.createElement(EC.MyAccount), ele[0]);
  }
});

EC.MyAccount = React.createClass({
  getInitialState: function () {
    return ({
      name: '',
      username: '',
      email: '',
      isSaving: false,
      selectedSchool: null,
      schoolOptions: [],
      schoolOptionsDoNotApply: false,
      password: null,
      passwordConfirmation: null
    });
  },
  componentDidMount: function () {
    $.ajax({
      url: '/teachers/my_account_data',
      data: {},
      success: this.populateData
    });
  },
  populateData: function (data) {
    console.log('data',data)
    var school = data.user.schools[0];
    var schoolData;
    if (school == null) {
      schoolData = null;
    } else {
      schoolData = {
        id: school.id,
        text: school.name,
        zipcode: school.zipcode
      };
      this.requestSchools(school.zipcode);
      // couldnt get react to re-render the default value of zipcode based on state change so have to use the below
      $('input.zip-input').val(school.zipcode);
    };
    this.setState({
      id: data.user.id,
      name: data.user.name,
      username: data.user.username,
      email: data.user.email,
      selectedSchool: schoolData
    });
  },
  displayHeader: function () {
    var str = this.state.name;
    var str2 = str + "'s Account";
    return str2;
  },
  updateName: function () {
    var x = $(this.refs.name.getDOMNode()).val();
    this.setState({name: x});
  },
  updateUsername: function () {
    var x = $(this.refs.username.getDOMNode()).val();
    this.setState({username: x});
  },
  updateEmail: function () {
    var x = $(this.refs.email.getDOMNode()).val();
    this.setState({email: x});
  },
  determineSaveButtonClass: function () {
    var className;
    if (this.state.isSaving) {
      className = 'button-grey';
    } else {
      className = 'button-green';
    }
    return className;
  },
  clickSave: function () {
    this.setState({isSaving: true});
    var data = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.passwordConfirmation,
      school_id: this.state.selectedSchool.id,
      school_options_do_not_apply: this.state.schoolOptionsDoNotApply
    }
    $.ajax({
      type: "PUT",
      data: data,
      url: '/teachers/update_my_account',
      success: this.uponUpdateAttempt
    });
  },
  uponUpdateAttempt: function (data) {
    console.log('uponj update attempt', data);
    this.setState({isSaving: false});
    if (data.user != null) {
      // name may have been capitalized on back-end
      this.setState({
        name: data.user.name,
      });
    } else {

    }
  },
  updateSchool: function (school) {
    this.setState({selectedSchool: school});
  },
  requestSchools: function (zip) {
    console.log('populate schools', zip);
    $.ajax({
      url: '/schools.json',
      data: {zipcode: zip},
      success: this.populateSchools
    });
  },
  populateSchools: function (data) {
    console.log('schools', data)
    this.setState({schoolOptions: data});
  },
  attemptDeleteAccount: function () {
    var confirmed = confirm('Are you sure you want to delete this account?');
    if (confirmed) {
      $.ajax({
        type: 'DELETE',
        url: '/teachers/delete_my_account',
        data: {id: this.state.id}
      }).done(function () {
         window.location.href="http://quill.org";
      });
    }
  },
  updateSchoolOptionsDoNotApply: function () {
    var x = $(this.refs.schoolOptionsDoNotApply.getDOMNode()).attr('checked');
    var schoolOptionsDoNotApply;
    console.log('checked', x);

    if (x == 'checked') {
      schoolOptionsDoNotApply = true;
    } else {
      schoolOptionsDoNotApply = false;
    }
    this.setState({schoolOptionsDoNotApply: schoolOptionsDoNotApply});
  },
  updateSubscribedToNewsletter: function () {
    var x = $(this.refs.subscribedToNewsletter.getDOMNode()).attr('checked');
    var subscribedToNewsletter;
    console.log('checked', x);
    if (x == 'checked') {
      subscribedToNewsletter = true;
    } else {
      subscribedToNewsletter = false;
    }
    this.setState({subscribedToNewsletter: subscribedToNewsletter});
  },
  determineIfSchoolOptionsDoNotApplyShouldBeChecked: function () {
    var value;
    if (this.state.schoolOptionsDoNotApply) {
      value = 'checked';
    } else {
      value = null;
    }
    return value;
  },
  updatePassword: function () {
    var password = $(this.refs.password.getDOMNode()).val()
    this.setState({password: password});
  },
  updatePasswordConfirmation: function () {
    var passwordConfirmation = $(this.refs.passwordConfirmation.getDOMNode()).val();
    this.setState({passwordConfirmation: passwordConfirmation});
  },
  render: function () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='row'>
              <h3 className='form-header col-xs-12'>
               {this.displayHeader()}
              </h3>
            </div>
            <div className='row'>
              <div className='form-label col-xs-2'>
                Real Name
              </div>
              <div className='col-xs-4'>
                <input ref='name' onChange={this.updateName} value={this.state.name}/>
              </div>
            </div>
            <div className='row'>
              <div className='form-label col-xs-2'>
                Username
              </div>
              <div className='col-xs-4'>
                <input ref='username' onChange={this.updateUsername} value={this.state.username}/>
              </div>
            </div>
            <div className='row'>
              <div className='form-label col-xs-2'>
                Email
              </div>
              <div className='col-xs-4'>
                <input ref='email' onChange={this.updateEmail} value={this.state.email}/>
              </div>
            </div>
            <div className='row'>
              <div className='form-label col-xs-2'>
                Password
              </div>
              <div className='col-xs-4'>
                <input ref='password' onChange={this.updatePassword} placeholder="Input New Password"/>
              </div>
            </div>
            <div className='row'>
              <div className='form-label col-xs-2'>
              </div>
              <div className='col-xs-4'>
                <input ref='passwordConfirmation' onChange={this.updatePasswordConfirmation} placeholder="Re-Enter New Password"/>
              </div>
            </div>
            <EC.SelectSchool selectedSchool={this.state.selectedSchool} schoolOptions={this.state.schoolOptions} requestSchools={this.requestSchools} updateSchool={this.updateSchool} />

            <div className='row school-checkbox'>
              <div className='form-label col-xs-2'>
              </div>
              <div className='col-xs-1 no-pr'>
                <input ref='schoolOptionsDoNotApply' onChange={this.updateSchoolOptionsDoNotApply} type='checkbox' checked={this.determineIfSchoolOptionsDoNotApplyShouldBeChecked()}/>
              </div>
              <div className='col-xs-6 no-pl form-label checkbox-label'>
                My school is not listed or I do not teach in the United States.
              </div>
            </div>

            <div className='row'>
              <div className='form-label col-xs-2'>
                Status
              </div>
              <div className='col-xs-2'>
                <input disabled className='inactive' value='Free'/>
              </div>
              <div className='col-xs-3'>
                <a href="http://quill.org/premium" target="_new">
                  <button className='get-premium'>Get Premium</button>
                </a>
              </div>

            </div>

            <div className='row'>
              <div className='col-xs-2'></div>
              <div className='col-xs-4'>
                <button onClick={this.clickSave} className={this.determineSaveButtonClass()}
                >Save Changes</button>
              </div>
            </div>

            <div className='row'>
              <div className='col-xs-2'></div>
              <div onClick={this.attemptDeleteAccount} className='col-xs-2 delete-account'>
                Delete Account
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});