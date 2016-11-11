import React from 'react'
import UserAccessibleSelectRole from '../components/accounts/edit/user_accessible_select_role.jsx'
export default React.createClass({

  render: function () {
    return (
      <div className="container user-select-role">
        <UserAccessibleSelectRole {...this.props}/>
      </div>
    );
  }
});
