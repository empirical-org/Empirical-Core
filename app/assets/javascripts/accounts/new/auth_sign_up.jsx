'use strict';
EC.AuthSignUp = React.createClass({
  render: function () {
    return (
      <div className='text-center'>
            <EC.GoogleSignUp/>
            <EC.CleverSignUp/>
      </div>
    );
  }
});
