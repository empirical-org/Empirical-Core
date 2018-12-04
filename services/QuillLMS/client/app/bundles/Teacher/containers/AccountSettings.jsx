import React from 'react'
import StudentAccountForm from '../components/accounts/edit/student_account_form.jsx'
export default React.createClass({

  render: function () {
    return (
      <div className="container user-select-role">
        <StudentAccountForm {...this.props}/>
      </div>
    );
  }
});
