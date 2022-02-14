import * as React from 'react';
const helpIcon = 'https://assets.quill.org/images/icons/help_icon.svg'

const CreateCustomizedEditionNavbar: React.SFC<any> = () =>
  (<div className="customize-navbar-container">
    <div className="customize-navbar">
      <div className="left">
        <span>Create Customized Edition</span>
        <span className="vertical-line" />
        <span>
          <a href="https://support.quill.org/using-quill-tools/quill-lessons/how-do-i-customize-a-quill-lesson">
            <img alt="" className="help" src={helpIcon} />Help
          </a>
        </span>
      </div>
      <div className="right" />
    </div>
  </div>)

export default CreateCustomizedEditionNavbar
