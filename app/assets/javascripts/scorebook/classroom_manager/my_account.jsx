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
      selectedSchool: null
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
    };
    this.setState({
      name: data.user.name,
      username: data.user.username,
      email: data.user.email,
      selectedSchool: schoolData
    });
    this.render();
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
    var x = $(this.refs.username.getDOMNode().val());
    this.setState({username: x});
  },
  updateEmail: function () {
    var x = $(this.refs.email.getDOMNode().val());
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
      school_id: this.state.school_id
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
  },
  updateSchool: function (school) {
    this.setState({selectedSchool: school});
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
            <EC.SelectSchool selectedSchool={this.state.selectedSchool} updateSchool={this.updateSchool} />

            <div className='row'>
              <div className='col-xs-2'></div>
              <div className='col-xs-4'>
                <button onClick={this.clickSave} className={this.determineSaveButtonClass()}
                >Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});