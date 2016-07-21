import React from 'react'
import RoleOption from './role_option'


export default React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <div className='container account-form' id='sign-up'>
        <div className='row sign_up_select_role'>
            <div className='row'>
              <h3 className='col-xs-12'>
                Sign up for Quill as:
              </h3>
            </div>
            <div className='option-wrapper'>
                <RoleOption selectRole={this.props.selectRole} role={'educator'}/>
                <RoleOption selectRole={this.props.selectRole} role={'student'}/>
            </div>
            <div className='row'>
              <div className='col-xs-12'>Already signed up? <a href='/session/new'>Return to Login</a></div>
            </div>
        </div>
        </div>
      );
  }
});
