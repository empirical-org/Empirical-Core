import React from 'react'
import createReactClass from 'create-react-class'
import UserAccessibleSelectRole from '../components/accounts/edit/user_accessible_select_role.jsx'
export default createReactClass({

  render: function () {
    return (
      <div className="container user-select-role">
        <UserAccessibleSelectRole {...this.props}/>
      </div>
    );
  }
});
