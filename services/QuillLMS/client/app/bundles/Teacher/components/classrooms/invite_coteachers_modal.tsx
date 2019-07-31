import * as React from 'react'
import * as moment from 'moment'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import GradeOptions from './grade_options'

import { requestPost, requestPut, requestGet } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface InviteCoteachersModalProps {
  close: (event) => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  user: any;
}

interface InviteCoteachersModalState {
  classrooms: Array<any>;
  postAssignments: boolean;
}

const headers = [
  {
    width: '316px',
    name: 'Class',
    attribute: 'name'
  }, {
    width: '84px',
    name: 'Created',
    attribute: 'created'
  }
]

export default class InviteCoteachersModal extends React.Component<InviteCoteachersModalProps, InviteCoteachersModalState> {
  constructor(props) {
    super(props)

    this.state = {
      email: props.coteacher ? props.coteacher.email : ''
    }

    this.inviteCoteachers = this.inviteCoteachers.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.checkRow = this.checkRow.bind(this)
    this.checkAllRows = this.checkAllRows.bind(this)
    this.uncheckAllRows = this.uncheckAllRows.bind(this)
  }

  footerButtonClass() {
    const { selectedClassroomIds, email } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!selectedClassroomIds.length || !email) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  checkRow(id) {
    const { selectedClassroomIds } = this.state
    const newSelectedClassroomIds = selectedClassroomIds.push(id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  uncheckRow(id) {
    const { selectedClassroomIds } = this.state
    const newSelectedClassroomIds = selectedClassroomIds.filter(selectedId => selectedId !== id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  checkAllRows() {
    const { classrooms } = this.state
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = true
      return classroom
    })
    this.setState({ classrooms: newClassrooms })
  }

  uncheckAllRows() {
    const { classrooms } = this.state
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = false
      return classroom
    })
    this.setState({ classrooms: newClassrooms })
  }
  inviteCoteachers() {
    const { onSuccess, } = this.props
    const { email, selectedClassroomIds } = this.state
    const dataForInvite = { classroom_ids: selectedClassroomIds, invitee_email: email }
    requestPost('/invitations/create_coteacher_invitation', dataForInvite, (body) => {
      onSuccess('Co-teacher invited')
    })
  }
  renderEmailInput() {
    const { coteacher } = this.props
    const { email } = this.state
    if (coteacher) {
      return <Input
        label="Co-teacher email"
        value={email}
        type="text"
        disabled={true}
        className="email"
      />
    } else {
      return <Input
        label="Co-teacher email"
        value={email}
        type="text"
        onChange={this.handleEmailChange}
        className="email"
      />
    }
  }


  returnModalContent() {
    return <div className="invite-coteachers-modal-content">
      <p>Co-teachers can do everything you can except move or merge students, archive classes, edit activity packs, and access your Premium features.</p>
      {this.renderEmailInput()}
      {this.renderDataTable()}
    </div>
  }

  renderDataTable() {
    if (this.state.classrooms.length) {
      const { classrooms, } = this.state

      const rows = classrooms.map(classroom => {
        const { name, createdAt, id } = classroom
        const created = moment(created_at).format('MMM DD, YYYY')
        const checked = !!selectedClassroomIds.find(selectedId => selectedId === id)
        return {
          name,
          id,
          created,
          checked
        }
      })

      return <DataTable
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        checkRow={this.checkRow}
        uncheckRow={this.uncheckRow}
        uncheckAllRows={this.uncheckAllRows}
        checkAllRows={this.checkAllRows}
      />
    }
  }

  render() {
    const { close } = this.props
    return <div className="modal-container invite-coteachers-modal-container">
      <div className="modal-background" />
      <div className="invite-coteachers-modal modal">

        <div className="invite-coteachers-modal-header">
          <h3 className="title">Invite co-teachers</h3>
        </div>

        <div className="invite-coteachers-modal-body modal-body">
          {this.renderModalContent()}
        </div>

        <div className="invite-coteachers-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            <button className={this.footerButtonClass()} onClick={this.inviteCoteachers}>Invite</button>
          </div>
        </div>

      </div>
    </div>
  }
}
