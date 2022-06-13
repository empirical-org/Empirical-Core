import React from 'react';
import DeleteAccountModal from './delete_account_modal'

export default class TeacherDangerZone extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteAccountModal: false,
    }
  }

  hideDeleteAccountModal = () => {
    this.setState({ showDeleteAccountModal: false, })
  };

  showDeleteAccountModal = () => {
    this.setState({ showDeleteAccountModal: true, })
  };

  renderModal() {
    if (this.state.showDeleteAccountModal) {
      return (
        <DeleteAccountModal
          cancel={this.hideDeleteAccountModal}
          deleteAccount={this.props.deleteAccount}
        />
      )
    }
  };

  render() {
    return (
      <div className="teacher-account-danger-zone user-account-section">
        {this.renderModal()}
        <h1>Danger zone</h1>
        <div className="quill-button outlined secondary medium" onClick={this.showDeleteAccountModal}>Delete my account</div>
        <p className="danger-zone-description">This will delete your user account, including all classes and reports.</p>
      </div>
    )
  }
}
