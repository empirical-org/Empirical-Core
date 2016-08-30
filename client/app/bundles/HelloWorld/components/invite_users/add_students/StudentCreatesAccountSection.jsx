import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div>
      <h1 className="section-header">
        Have Students Create Their Accounts
      </h1>
      <ol>
        <li>
          Have students sign up at quill.org/account/new
        </li>
        <li>
          Once students sign up, in the "Join My Class" field,
          <br/>they enter the class code <code>{this.props.classCode}</code>
        </li>
      </ol>
        <span className="class-code">Class Code</span><code><input className="inactive" disabled="" type="text" value={this.props.classCode}/></code>
      </div>
    );
   }
 });
