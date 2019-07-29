import * as React from 'react'

import { requestPost } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

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
    requestPost(`/classrooms_teachers/${coteacher.id}/remove_coteacher_from_class`, { classroom_id: classroom.id }, (body) => {
      onSuccess('Co-teacher removed')
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
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img src={smallWhiteCheckSrc} alt="check" /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    return (<div className="checkboxes">
      <div className="checkbox-row">
        {this.renderCheckbox('checkboxOne')}
        <span>I understand that the co-teacher will no longer have access to the students’ work or data.</span>
      </div>
    </div>)
  }

  render() {
    const { selectedStudentIds, close } = this.props
    const numberOfSelectedStudents = selectedStudentIds.length
    return <div className="modal-container remove-coteacher-modal-container">
      <div className="modal-background" />
      <div className="remove-coteacher-modal modal modal-body">
        <div>
          <h3 className="title">Remove co-teacher from your class?</h3>
        </div>
        <p>Students' Quill accounts will remain active. If you bring students back into the class, the data from their completed activities will be restored.</p>
        {this.renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.removeCoteacher}>Remove from class</button>
        </div>
      </div>
    </div>
  }
}
