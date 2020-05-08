import * as React from 'react'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

interface ViewAsStudentModalProps {
  classrooms: Array<any>;
  close: () => void;
  defaultClassroomId?: number;
}

interface ViewAsStudentModalState {
  selectedClassroom: any;
  classroomOptions: Array<any>;
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


export default class ViewAsStudentModal extends React.Component<ViewAsStudentModalProps, ViewAsStudentModalState> {
  constructor(props: ViewAsStudentModalProps) {
    super(props)

    const { classrooms, defaultClassroomId, } = props

    const classroomOptions = classrooms.map(classroom => {
      classroom.value = classroom.id
      classroom.label = classroom.name
      return classroom
    }).sort((classroomA, classroomB) => classroomA.created_at - classroomB.created_at)

    const selectedClassroom = defaultClassroomId ? classroomOptions.find(classroom => classroom.id === defaultClassroomId) : classroomOptions[0]

    this.state = {
      selectedClassroom,
      classroomOptions
    }
  }

  onSelectClassroom = (classroom: any) => {
    this.setState({ selectedClassroom: classroom, })
  }

  renderDataTable() {
    const { selectedClassroom, } = this.state

    const rows = selectedClassroom.students.map(classroom => {
      const { name, username, id } = classroom
      return {
        name,
        username,
        id,
        viewButton: <a className="quill-button outlined fun secondary" href={`/teachers/preview_as_student/${id}`}>View</a>
      }
    })

    return (<DataTable
      headers={headers}
      rows={rows}
    />)
  }

  render() {
    const { close, } = this.props
    const { classroomOptions, selectedClassroom, } = this.state
    return (<div className="modal-container view-as-student-modal-container">
      <div className="modal-background" />
      <div className="view-as-student-modal quill-modal modal-body">
        <div className="top-section">
          <h3 className="title">Choose a student dashboard to view</h3>
        </div>
        <div className="middle-section">
          <DropdownInput
            className="classroom-dropdown"
            handleChange={this.onSelectClassroom}
            label="Class"
            options={classroomOptions}
            value={selectedClassroom}
          />
          {this.renderDataTable()}
        </div>
        <div className="bottom-section">
          <button className="quill-button medium secondary outlined" onClick={close} type="button">Cancel</button>
        </div>
      </div>
    </div>)
  }
}
