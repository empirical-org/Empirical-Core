import * as React from 'react'
import * as moment from 'moment'
import Pusher from 'pusher-js';

import GradeOptions from './grade_options'

import { DropdownInput, DataTable } from '../../../Shared/index'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { requestPost, requestPut } from '../../../../modules/request/index';

interface ImportGoogleClassroomsModalProps {
  close: (event) => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  user: any;
}

interface ImportGoogleClassroomsModalState {
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
    width: '32px',
    name: 'Year',
    attribute: 'year'
  }, {
    width: '51px',
    name: 'Students',
    attribute: 'students'
  }
]

export default class ImportGoogleClassroomsModal extends React.Component<ImportGoogleClassroomsModalProps, ImportGoogleClassroomsModalState> {
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

  toggleRowCheck = (id) => {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.id === id)
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

  handleGradeChange = (classroomId, grade) => {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.id === classroomId)
    classroom.grade = grade.value
    this.setState({ classrooms })
  }

  initializePusherForGoogleStudentImport(id) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(id)
    const channel = pusher.subscribe(channelName);
    const that = this;
    channel.bind('google-classroom-students-imported', () => {
      that.props.onSuccess('Classes imported')
      pusher.unsubscribe(channelName)
    });
  }

  handleClickImportClasses = () => {
    const { classrooms } = this.state
    const classroomsCheckedWithNoGrade = classrooms.filter(classroom => classroom.checked && !classroom.grade)

    if (classroomsCheckedWithNoGrade.length) {
      const newClassrooms = classrooms.map(c => {
        if (classroomsCheckedWithNoGrade.find(noGradeClassroom => noGradeClassroom.id === c.id)) {
          c.error = 'Select a grade for your class'
        }
        return c
      })
      this.setState(prevState => ({ classrooms: newClassrooms, timesSubmitted: prevState.timesSubmitted + 1, }))
      return
    }

    this.setState({ waiting: true })
    const selectedClassrooms = classrooms.filter(classroom => classroom.checked)

    requestPost('/teachers/classrooms/update_google_classrooms', { selected_classrooms: selectedClassrooms, }, (body) => {
      const newClassrooms = body.classrooms.filter(classroom => selectedClassrooms.find(sc => sc.id === classroom.google_classroom_id))
      const selectedClassroomIds = newClassrooms.map(classroom => classroom.id)
      requestPut('/teachers/classrooms/import_google_students', { selected_classroom_ids: selectedClassroomIds }, (body) => {
        this.initializePusherForGoogleStudentImport(body.id)
      })
    })
  }

  renderModalContent() {
    const { classrooms, timesSubmitted,} = this.state

    if (!classrooms.length) { return }

    const rows = classrooms.map(classroom => {
      const { name, username, id, creationTime, studentCount, checked, grade, error } = classroom
      const year = moment(creationTime).format('YYYY')
      const gradeOption = GradeOptions.find(go => go.value === grade)
      const gradeSelector = (<DropdownInput
        className="grade"
        error={error && !grade ? error : null}
        handleChange={(g) => this.handleGradeChange(id, g)}
        label="Select a grade"
        options={GradeOptions}
        timesSubmitted={timesSubmitted}
        value={gradeOption}
      />)
      return {
        name,
        id,
        username,
        checked,
        year,
        className: error && !grade ? 'error' : '',
        grade: checked ? gradeSelector : null,
        students: studentCount
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
      return <button aria-label="Loading" className={this.footerButtonClass()} type="button"><ButtonLoadingIndicator /></button>
    } else {
      return <button className={this.footerButtonClass()} onClick={this.handleClickImportClasses} type="button">Import classes</button>
    }
  }

  render() {
    const { close } = this.props
    return (
      <div className="modal-container import-google-classrooms-modal-container">
        <div className="modal-background" />
        <div className="import-google-classrooms-modal quill-modal">

          <div className="import-google-classrooms-modal-header">
            <h3 className="title">Import classes from Google Classroom</h3>
          </div>

          <div className="import-google-classrooms-modal-body modal-body">
            {this.renderModalContent()}
          </div>

          <div className="import-google-classrooms-modal-footer">
            <div className="buttons">
              <button className="quill-button outlined secondary medium" onClick={close} type="button">Cancel</button>
              {this.renderImportButton()}
            </div>
          </div>

        </div>
      </div>
    )
  }
}
