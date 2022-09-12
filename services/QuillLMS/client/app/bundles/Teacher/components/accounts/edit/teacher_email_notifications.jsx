import React from 'react';
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

export default class TeacherEmailNotifications extends React.Component {
  toggleSendNewsletter = () => {
    const { sendNewsletter, updateUser, } = this.props
    const data = {
      send_newsletter: !sendNewsletter,
      school_options_do_not_apply: true
    };
    updateUser(data, '/teachers/update_my_account', 'Settings saved')
  };

  renderCheckbox() {
    const { sendNewsletter, } = this.props
    if (sendNewsletter) {
      return <div className="quill-checkbox selected" onClick={this.toggleSendNewsletter}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.toggleSendNewsletter} />
    }
  }

  render() {
    return (
      <div className="teacher-account-email-notifications user-account-section">
        <h1>Email notifications</h1>
        <div className="checkboxes">
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxOne')}
            <span>Receive bi-weekly newsletter (every two weeks)</span>
          </div>
        </div>
      </div>
    )
  }
}
