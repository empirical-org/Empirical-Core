'use strict';
EC.AuthSignUp = React.createClass({
  render: function () {
    return (
      <span>
        <div className='row'>
          <div className='col-xs-8'>
            <EC.GoogleSignUp/>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-8'>
            <EC.CleverSignUp/>
          </div>
        </div>
      </span>
    );
  }
});
