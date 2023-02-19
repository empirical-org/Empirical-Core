import * as React from 'react'

import { requestPost, requestDelete } from '../../../../modules/request/index';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface RemoveCoteacherModalProps {
  close: () => void;
  onSuccess: (string) => void;
  coteacher: any;
  classroom: any;
}

interface RemoveCoteacherModalState {
  checkboxOne?: boolean;
}

export default class RemoveCoteacherModal extends React.Component<RemoveCoteacherModalProps, RemoveCoteacherModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.removeCoteacher = this.removeCoteacher.bind(this)
  }

  removeCoteacher() {
    const { onSuccess, close, classroom, coteacher, } = this.props
    const callback = (body) => {
      onSuccess('Co-teacher removed')
      close()
    }
    if (coteacher.invitation_id) {
      requestDelete(`/coteacher_classroom_invitations/${coteacher.id}`, {}, callback)
    } else {
      requestPost(`/classrooms_teachers/${coteacher.id}/remove_coteacher`, { classroom_id: classroom.id }, callback)
    }
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
          <span>I understand that the co-teacher will no longer have access to the students’ work or data.</span>
        </div>
      </div>
    )
  }

  render() {
    const { coteacher, close } = this.props
    let coteacherName = `${coteacher.name}'s`
    if (coteacher.invitation_id) {
      coteacherName = "This co-teacher's"
    }
    return (
      <div className="modal-container remove-coteacher-modal-container">
        <div className="modal-background" />
        <div className="remove-coteacher-modal quill-modal modal-body">
          <div>
            <h3 className="title">Remove co-teacher from your class?</h3>
          </div>
          <p>{coteacherName} ({coteacher.email}) Quill account will remain active. You can re-invite the co-teacher later.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            <button className={this.submitButtonClass()} onClick={this.removeCoteacher}>Remove from class</button>
          </div>
        </div>
      </div>
    )
  }
}
