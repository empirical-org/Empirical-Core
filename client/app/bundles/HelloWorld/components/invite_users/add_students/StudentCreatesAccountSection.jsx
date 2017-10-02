import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div>
      <div className="box-top">
        <h1>
          <span>Option 1: </span>Students Create Their Accounts
        </h1>
      </div>
      <div className="box-content">
          <p>
            1. Have students sign up at <span>quill.org/account/new</span>
          </p>
          <p>
            2. Once students sign up, in the <span>"Join My Class"</span> field, they enter the class code.
          </p>
          <span>Class Code:</span><input className="inactive class-code" readOnly type="text" value={this.props.classCode}/>
        </div>
      </div>
    );
   }
 });
