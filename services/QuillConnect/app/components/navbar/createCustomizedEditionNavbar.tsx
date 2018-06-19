import * as React from 'react';
const helpIcon = require('../../img/help_icon.svg')

/** @augments {React.SFC<object, object>} */
const CreateCustomizedEditionNavbar: React.SFC<any> = () =>
  <div className="customize-navbar-container">
    <div className="customize-navbar">
      <div className="left">
        <span>Create Customized Edition</span>
        <span className="vertical-line"></span>
        <span>
          <a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson">
            <img className="help" src={helpIcon}/>Help
          </a>
        </span>
      </div>
      <div className="right">
      </div>
    </div>
  </div>

export default CreateCustomizedEditionNavbar
