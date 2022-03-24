import * as React from 'react'

import { DataTable, DropdownInput, } from '../../../Shared/index'
import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../progress_reports/progress_report_constants'

interface ViewAsStudentModalProps {
  classrooms: Array<any>;
  close: () => void;
  handleViewClick: (studentId: number|string) => void;
  defaultClassroomId?: number;
}

const headers = [
  {
    width: '160px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '361px',
    name: 'Username',
    attribute: 'username'
  }, {
    width: '88px',
    name: '',
    attribute: 'viewButton',
    noTooltip: true,
    headerClassName: 'view-button-section',
    rowSectionClassName: 'view-button-section'
  }
]

function renderViewButton(handleViewClick: (id: string|number) => void, id: string|number) {
  function onClickView() {
    return handleViewClick(id)
  }

  return <button className="quill-button outlined fun secondary" onClick={onClickView} type="button">View</button>
}

function renderDataTable(selectedClassroom: any, handleViewClick: (id: string|number) => void) {
  const rows = selectedClassroom.students.map(classroom => {
    const { name, username, id } = classroom
    return {
      name,
      username,
      id,
      viewButton: renderViewButton(handleViewClick, id)
    }
  })

  return (
    <DataTable
      headers={headers}
      rows={rows}
    />
  )
}

export default function ViewAsStudentModal({classrooms, close, defaultClassroomId, handleViewClick}: ViewAsStudentModalProps) {

  const classroomsWithStudents = classrooms.filter(classroom => classroom.students.length)
  const classroomsSortedByCreationDate = classroomsWithStudents.sort((classroomA, classroomB) => new Date(classroomB.created_at) - new Date(classroomA.created_at))
  const classroomOptions = classroomsSortedByCreationDate.map(classroom => {
    classroom.value = classroom.id
    classroom.label = classroom.name
    return classroom
  })

  const classroomId = defaultClassroomId || window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
  const classroomFromClassroomId = classroomOptions.find(classroom => Number(classroom.id) === Number(classroomId))
  const [selectedClassroom, setSelectedClassroom] = React.useState(classroomFromClassroomId || classroomOptions[0])

  function onSelectClassroom(classroom: any) {
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, classroom.id)
    return setSelectedClassroom(classroom)
  }
  return (
    <div className="modal-container view-as-student-modal-container">
      <div className="modal-background" />
      <div className="view-as-student-modal quill-modal modal-body">
        <div className="top-section">
          <h3 className="title">Choose a student dashboard to view</h3>
        </div>
        <div className="middle-section">
          <DropdownInput
            className="classroom-dropdown"
            handleChange={onSelectClassroom}
            label="Class"
            options={classroomOptions}
            value={selectedClassroom}
          />
          {renderDataTable(selectedClassroom, handleViewClick)}
        </div>
        <div className="bottom-section">
          <button className="quill-button medium secondary outlined" onClick={close} type="button">Cancel</button>
        </div>
      </div>
    </div>
  )
}

ViewAsStudentModal.defaultProps = {
  defaultClassroomId: window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)
}
