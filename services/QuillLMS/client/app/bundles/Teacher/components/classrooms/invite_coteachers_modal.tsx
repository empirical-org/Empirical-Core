import * as React from 'react'
import * as moment from 'moment'

import { Input, DataTable, } from '../../../Shared/index'
import { requestPost, } from '../../../../modules/request/index';

interface InviteCoteachersModalProps {
  close: () => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  classroom: any;
  coteacher: any;
}

interface InviteCoteachersModalState {
  selectedClassroomIds: Array<string|number>;
  email: string;
}

const headers = [
  {
    width: '280px',
    name: 'Class',
    attribute: 'name'
  }, {
    width: '100px',
    name: 'Created',
    attribute: 'created'
  }
]

export default class InviteCoteachersModal extends React.Component<InviteCoteachersModalProps, InviteCoteachersModalState> {
  constructor(props) {
    super(props)

    this.state = {
      email: props.coteacher ? props.coteacher.email : '',
      selectedClassroomIds: [props.classroom.id]
    }

    this.inviteCoteachers = this.inviteCoteachers.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.checkRow = this.checkRow.bind(this)
    this.uncheckRow = this.uncheckRow.bind(this)
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

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  checkRow(id) {
    const { selectedClassroomIds } = this.state
    const newSelectedClassroomIds = selectedClassroomIds.concat(id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  uncheckRow(id) {
    const { selectedClassroomIds } = this.state
    const newSelectedClassroomIds = selectedClassroomIds.filter(selectedId => selectedId !== id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  checkAllRows() {
    const { classrooms } = this.props
    const newSelectedClassroomIds = classrooms.map(classroom => classroom.id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  uncheckAllRows() {
    this.setState({ selectedClassroomIds: [] })
  }

  inviteCoteachers() {
    const { onSuccess, close, } = this.props
    const { email, selectedClassroomIds } = this.state
    const dataForInvite = { classroom_ids: selectedClassroomIds, invitee_email: email.trim() }
    requestPost('/invitations/create_coteacher_invitation', dataForInvite, (body) => {
      onSuccess('Co-teacher invited')
      close()
    })
  }

  renderEmailInput() {
    const { coteacher } = this.props
    const { email } = this.state
    if (coteacher) {
      return (
        <Input
          className="email disabled"
          disabled={true}
          label="Co-teacher email"
          type="text"
          value={email}
        />
      )
    } else {
      return (
        <Input
          className="email"
          handleChange={this.handleEmailChange}
          label="Co-teacher email"
          placeholder="teacher@example.edu"
          type="text"
          value={email}
        />
      )
    }
  }

  renderModalContent() {
    return (
      <div className="invite-coteachers-modal-content">
        <p>Co-teachers can do everything you can except move or merge students, archive classes, edit activity packs, and access your Premium features.</p>
        {this.renderEmailInput()}
        {this.renderDataTable()}
      </div>
    )
  }

  renderDataTable() {
    const { classrooms, coteacher, } = this.props
    const { selectedClassroomIds, } = this.state

    let possibleClassrooms = classrooms

    if (coteacher) {
      possibleClassrooms = classrooms.filter(classroom => {
        return !classroom.teachers.find(teacher => teacher.id === coteacher.id)
      })
    }

    const rows = possibleClassrooms.map(classroom => {
      const { name, created_at, id } = classroom
      const created = moment(created_at).format('MMM DD, YYYY')
      const checked = !!selectedClassroomIds.find(selectedId => selectedId === id)
      return {
        name,
        id,
        created,
        checked
      }
    })

    return (
      <DataTable
        checkAllRows={this.checkAllRows}
        checkRow={this.checkRow}
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        uncheckAllRows={this.uncheckAllRows}
        uncheckRow={this.uncheckRow}
      />
    )
  }

  render() {
    const { close } = this.props
    return (
      <div className="modal-container invite-coteachers-modal-container">
        <div className="modal-background" />
        <div className="invite-coteachers-modal quill-modal">

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
    )
  }
}
