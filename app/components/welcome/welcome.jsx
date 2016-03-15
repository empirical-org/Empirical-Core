import React from "react";

export default React.createClass({
  render: function () {
    return (
      <div className="container">
        <h3 className="panel-title">Hello world.</h3>
        <br/>
        <p>
          Click below to launch an activity.
        </p>
        <a onClick={this.props.start.bind(null, 'activity')}>Activity</a>
      </div>
    )
  }
});
