import * as React from 'react';

import { requestPost } from '../../../../modules/request/index';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface TransferOwnershipModalProps {
  close: () => void;
  onSuccess: (string) => void;
  coteacher: any;
  classroom: any;
}

interface TransferOwnershipModalState {
  checkboxOne?: boolean;
}

export default class TransferOwnershipModal extends React.Component<TransferOwnershipModalProps, TransferOwnershipModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.transferOwnership = this.transferOwnership.bind(this)
  }

  transferOwnership() {
    const { onSuccess, close, classroom, coteacher, } = this.props
    requestPost(`/teachers/classrooms/${classroom.id}/transfer_ownership`, { requested_new_owner_id: coteacher.id }, (body) => {
      onSuccess('Class transferred')
      close()
    })
  }

  submitButtonClass() {
    const { checkboxOne, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!checkboxOne) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  toggleCheckbox(checkboxNumber: 'checkboxOne'|'checkboxTwo'|'checkboxThree') {
    const newStateObj:{[K in CheckboxNames]?: boolean} = { [checkboxNumber]: !this.state[checkboxNumber], }
    this.setState(newStateObj)
  }

  renderCheckbox(checkboxNumber) {
    const checkbox = this.state[checkboxNumber]
    if (checkbox) {
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox('checkboxOne')}
          <span>I understand that I will no longer have the ability to archive classes or edit activity packs.</span>
        </div>
      </div>
    )
  }

  render() {
    const { coteacher, close, classroom } = this.props
    return (
      <div className="modal-container transfer-ownership-modal-container">
        <div className="modal-background" />
        <div className="transfer-ownership-modal quill-modal modal-body">
          <div>
            <h3 className="title">Transfer ownership of this class?</h3>
          </div>
          <p>You are transferring the class {classroom.name} to {coteacher.name} ({coteacher.email}). You will still have access to the class as a co-teacher.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            <button className={this.submitButtonClass()} onClick={this.transferOwnership}>Transfer class</button>
          </div>
        </div>
      </div>
    )
  }
}
