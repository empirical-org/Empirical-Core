import * as React from 'react'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'


interface ViewAsStudentModalProps {
  classrooms: Array<any>;
  close: () => void;
  defaultClassroomId?: number;
}

interface ViewAsStudenModalState {
  selectedClassroom: any;
  classroomOptions: Array<any>;
}

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

  onSelectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom, })
  }

  render() {
    const { classroomOptions, selectedClassroom, } = this.state
    return (<div className="modal-container view-as-student-modal-container">
      <div className="modal-background"/>
      <div className="view-as-student-modal quill-modal modal-body">
        <h3 className="title">Choose a student dashboard to view</h3>
        <DropdownInput
          className="classroom-dropdown"
          handleChange={this.onSelectClassroom}
          label="Class"
          options={classroomOptions}
          value={selectedClassroom}
        />
      </div>
    </div>)
  }
}
