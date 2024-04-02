import moment from 'moment';
import * as React from 'react';

import { requestPost, } from '../../../../modules/request/index';
import { DataTable, Input, Spinner, } from '../../../Shared/index';

interface InviteCoteachersModalProps {
  close: () => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  classroom: any;
  coteacher: any;
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

export const InviteCoteachersModal = ({ close, onSuccess, classrooms, classroom, coteacher }: InviteCoteachersModalProps) => {
  const [email, setEmail] = React.useState<string>(coteacher && coteacher.email ? coteacher.email : '');
  const [selectedClassroomIds, setSelectedClassroomIds] = React.useState<number[]>([classroom.id]);
  const [loading, setLoading] = React.useState<boolean>(false);

  function footerButtonClass() {
    let buttonClass = 'quill-button contained primary medium focus-on-light';
    if (!selectedClassroomIds.length || !email) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  function handleEmailChange(event) {
    const { target } = event
    const { value } = target
    setEmail(value)
  }

  function checkRow(id) {
    const newSelectedClassroomIds = selectedClassroomIds.concat(id)
    setSelectedClassroomIds(newSelectedClassroomIds)
  }

  function uncheckRow(id) {
    const newSelectedClassroomIds = selectedClassroomIds.filter(selectedId => selectedId !== id)
    setSelectedClassroomIds(newSelectedClassroomIds)
  }

  function checkAllRows() {
    const newSelectedClassroomIds = classrooms.map(classroom => classroom.id)
    setSelectedClassroomIds(newSelectedClassroomIds)
  }

  function uncheckAllRows() {
    setSelectedClassroomIds([])
  }

  function inviteCoteachers() {
    const dataForInvite = { classroom_ids: selectedClassroomIds, invitee_email: email.trim() }
    setLoading(true)
    requestPost('/invitations/create_coteacher_invitation', dataForInvite, (body) => {
      onSuccess('Co-teacher invited')
      setLoading(false)
      close()
    })
  }

  function renderEmailInput() {
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
          handleChange={handleEmailChange}
          label="Co-teacher email"
          placeholder="teacher@example.edu"
          type="text"
          value={email}
        />
      )
    }
  }

  function renderModalContent() {
    return (
      <div className="invite-coteachers-modal-content">
        <p>Co-teachers can do everything you can except move or merge students, archive classes, edit activity packs, and access your Premium features.</p>
        {renderEmailInput()}
        {renderDataTable()}
      </div>
    )
  }

  function renderDataTable() {

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
        checkAllRows={checkAllRows}
        checkRow={checkRow}
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        uncheckAllRows={uncheckAllRows}
        uncheckRow={uncheckRow}
      />
    )
  }

  function renderButtons() {
    if(loading) {
      return(
        <div className="buttons">
          <button className="quill-button outlined secondary medium disabled" disabled={true} onClick={close}>Cancel</button>
          <button className="quill-button contained primary medium disabled" disabled={true} onClick={inviteCoteachers}>
            <Spinner />
          </button>
        </div>
      )
    }
    return(
      <div className="buttons">
        <button className="quill-button outlined secondary medium focus-on-light" onClick={close}>Cancel</button>
        <button className={footerButtonClass()} onClick={inviteCoteachers}>Invite</button>
      </div>
    )
  }

  return (
    <div className="modal-container invite-coteachers-modal-container">
      <div className="modal-background" />
      <div className="invite-coteachers-modal quill-modal">

        <div className="invite-coteachers-modal-header">
          <h3 className="title">Invite co-teachers</h3>
        </div>

        <div className="invite-coteachers-modal-body modal-body">
          {renderModalContent()}
        </div>

        <div className="invite-coteachers-modal-footer">
          {renderButtons()}
        </div>
      </div>
    </div>
  )
}

export default InviteCoteachersModal
