import * as React from 'react'
import Pusher from 'pusher-js';

import GradeOptions from './grade_options'

import { DropdownInput, DataTable } from '../../../Shared/index'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { requestPost } from '../../../../modules/request/index.js';

interface ImportCleverClassroomsModalProps {
  close: (event) => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  user: any;
}

interface ImportCleverClassroomsModalState {
  classrooms: Array<any>;
  waiting: boolean;
  timesSubmitted: number;
}

const headers = [
  {
    width: '510px',
    name: 'Class',
    attribute: 'name'
  }, {
    width: '110px',
    name: 'Grade',
    attribute: 'grade',
    rowSectionClassName: 'show-overflow'
  }, {
    width: '51px',
    name: 'Students',
    attribute: 'students'
  }
]

export default class ImportCleverClassroomsModal extends React.Component<ImportCleverClassroomsModalProps, ImportCleverClassroomsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      classrooms: props.classrooms,
      waiting: false,
      timesSubmitted: 0
    }
  }

  footerButtonClass() {
    const { classrooms } = this.state
    let buttonClass = 'quill-button contained primary medium';
    const noClassroomsChecked = classrooms.every(classroom => !classroom.checked)
    if (noClassroomsChecked) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  toggleRowCheck = (rowId) => {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.clever_id === rowId)
    classroom.checked = !classroom.checked
    this.setState({ classrooms })
  }

  checkAllRows = () => {
    const { classrooms } = this.state
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = true
      return classroom
    })
    this.setState({ classrooms: newClassrooms })
  }

  uncheckAllRows = () => {
    const { classrooms } = this.state
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = false
      return classroom
    })
    this.setState({ classrooms: newClassrooms })
  }

  handleGradeChange = (classroomCleverId, grade) => {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.clever_id === classroomCleverId)
    classroom.grade = grade.value
    this.setState({ classrooms })
  }

  initializePusherForCleverStudentImport(userId) {
    if (process.env.RAILS_ENV === 'development') { Pusher.logToConsole = true }

    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(userId)
    const channel = pusher.subscribe(channelName);
    const { onSuccess } = this.props

    channel.bind('clever-classroom-students-imported', () => {
      onSuccess('Classes imported')
      pusher.unsubscribe(channelName)
    })
  }

  handleClickImportClasses = () => {
    const { classrooms } = this.state
    const selectedClassrooms = classrooms.filter(classroom => classroom.checked)

    this.setState({ waiting: true })

    requestPost('/clever_integration/teachers/import_classrooms', { selected_classrooms: selectedClassrooms }, body => {
      this.initializePusherForCleverStudentImport(body.user_id)
    })
  }

  renderModalContent() {
    const { classrooms, timesSubmitted,} = this.state

    if (!classrooms.length) { return }

    const rows = classrooms.map(classroom => {
      const { name, clever_id, students, checked, grade } = classroom
      const gradeValue = parseInt(grade) || grade
      const gradeOption = GradeOptions.find(gradeOption => gradeOption.value === gradeValue)
      const gradeSelector = (
        <DropdownInput
          className="grade"
          handleChange={(g) => this.handleGradeChange(clever_id, g)}
          label="Select a grade"
          options={GradeOptions}
          timesSubmitted={timesSubmitted}
          value={gradeOption}
        />
      )

      return {
        name,
        id: clever_id,
        checked,
        grade: checked ? gradeSelector : null,
        students: students.length,
        key: clever_id
      }
    })

    return (
      <DataTable
        checkAllRows={this.checkAllRows}
        checkRow={this.toggleRowCheck}
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        uncheckAllRows={this.uncheckAllRows}
        uncheckRow={this.toggleRowCheck}
      />
    )
  }

  renderImportButton() {
    const { waiting } = this.state
    if (waiting) {
      return (
        <button
          aria-label="Loading"
          className={this.footerButtonClass()}
          key="loading-import-button"
          type="button"
        >
          <ButtonLoadingIndicator />
        </button>
      )
    } else {
      return (
        <button
          className={this.footerButtonClass()}
          key="import-button"
          onClick={this.handleClickImportClasses}
          type="button"
        >
          Import classes
        </button>
      )
    }
  }

  render() {
    const { close } = this.props

    return (
      <div className="modal-container import-clever-classrooms-modal-container">
        <div className="modal-background" />
        <div className="import-clever-classrooms-modal quill-modal">
          <div className="import-clever-classrooms-modal-header">
            <h3 className="title">
              Import classes from Clever
            </h3>
          </div>
          <div className="import-clever-classrooms-modal-body modal-body">
            {this.renderModalContent()}
          </div>
          <div className="import-clever-classrooms-modal-footer">
            <div className="buttons">
              <button
                className="quill-button outlined secondary medium"
                key="cancel-button"
                onClick={close}
                type="button"
              >
                Cancel
              </button>
              {this.renderImportButton()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
