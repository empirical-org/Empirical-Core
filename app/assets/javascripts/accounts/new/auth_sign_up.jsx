'use strict';
EC.AuthSignUp = React.createClass({
  render: function () {
    return (
      <span>
            <EC.GoogleSignUp/>
            <EC.CleverSignUp/>
      </span>
    );
  }
});
