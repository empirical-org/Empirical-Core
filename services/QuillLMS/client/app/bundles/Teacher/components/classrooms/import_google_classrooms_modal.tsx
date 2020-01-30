import * as React from 'react'
import * as moment from 'moment'
import Pusher from 'pusher-js';

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import GradeOptions from './grade_options'

import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { requestPost, requestPut, requestGet } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface ImportGoogleClassroomsModalProps {
  close: (event) => void;
  onSuccess: (event) => void;
  classrooms: Array<any>;
  user: any;
}

interface ImportGoogleClassroomsModalState {
  classrooms: Array<any>;
  postAssignments: boolean;
  waiting: boolean;
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
      postAssignments: !!props.user.post_google_classroom_assignments,
      waiting: false
    }

    this.importClasses = this.importClasses.bind(this)
    this.togglePostAssignments = this.togglePostAssignments.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.toggleRowCheck = this.toggleRowCheck.bind(this)
    this.checkAllRows = this.checkAllRows.bind(this)
    this.uncheckAllRows = this.uncheckAllRows.bind(this)
  }

  footerButtonClass() {
    const { classrooms } = this.state
    let buttonClass = 'quill-button contained primary medium';
    const noClassroomsChecked = classrooms.every(classroom => !classroom.checked)
    const anyClassroomsCheckedWithNoGrade = classrooms.find(classroom => classroom.checked && !classroom.grade)
    if (noClassroomsChecked || anyClassroomsCheckedWithNoGrade) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  togglePostAssignments() {
    this.setState({ postAssignments: !this.state.postAssignments })
  }

  toggleRowCheck(id) {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.id === id)
    classroom.checked = !classroom.checked
    this.setState({ classrooms })
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

  handleGradeChange(classroomId, grade) {
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.id === classroomId)
    classroom.grade = grade.value
    this.setState({ classrooms })
  }

  renderCheckbox() {
    const { postAssignments } = this.state
    if (postAssignments) {
      return <div className="quill-checkbox selected" onClick={this.togglePostAssignments}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.togglePostAssignments} />
    }
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

  importClasses() {
    const { classrooms, postAssignments, } = this.state

    this.setState({ waiting: true })
    const selectedClassrooms = classrooms.filter(classroom => classroom.checked)
    const dataForUserUpdate = {
      post_google_classroom_assignments: postAssignments,
      school_options_do_not_apply: true
    };

    requestPut('/teachers/update_my_account', dataForUserUpdate)

    requestPost('/teachers/classrooms/update_google_classrooms', { selected_classrooms: selectedClassrooms, }, (body) => {
      const newClassrooms = body.classrooms.filter(classroom => selectedClassrooms.find(sc => sc.id === classroom.google_classroom_id))
      const selectedClassroomIds = newClassrooms.map(classroom => classroom.id)
      requestPut('/teachers/classrooms/import_google_students', { selected_classroom_ids: selectedClassroomIds }, (body) => {
        this.initializePusherForGoogleStudentImport(body.id)
      })
    })
  }

  renderModalContent() {
    if (this.state.classrooms.length) {
      const { classrooms, } = this.state

      const rows = classrooms.map(classroom => {
        const { name, username, id, creationTime, studentCount, checked, grade } = classroom
        const year = moment(creationTime).format('YYYY')
        const gradeOption = GradeOptions.find(go => go.value === grade)
        const gradeSelector = (<DropdownInput
          className="grade"
          handleChange={(g) => this.handleGradeChange(id, g)}
          label="Select a grade"
          options={GradeOptions}
          value={gradeOption}
        />)
        return {
          name,
          id,
          username,
          checked,
          year,
          grade: checked ? gradeSelector : null,
          students: studentCount
        }
      })

      return (<DataTable
        checkAllRows={this.checkAllRows}
        checkRow={this.toggleRowCheck}
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        uncheckAllRows={this.uncheckAllRows}
        uncheckRow={this.toggleRowCheck}
      />)
    }
  }

  renderImportButton() {
    const { waiting } = this.state
    if (waiting) {
      return <button className={this.footerButtonClass()}><ButtonLoadingIndicator /></button>
    } else {
      return <button className={this.footerButtonClass()} onClick={this.importClasses}>Import classes</button>
    }
  }

  render() {
    const { close } = this.props
    return (<div className="modal-container import-google-classrooms-modal-container">
      <div className="modal-background" />
      <div className="import-google-classrooms-modal quill-modal">

        <div className="import-google-classrooms-modal-header">
          <h3 className="title">Import classes from Google Classroom</h3>
        </div>

        <div className="import-google-classrooms-modal-body modal-body">
          {this.renderModalContent()}
        </div>

        <div className="import-google-classrooms-modal-footer">
          <div className="checkbox-row">
            {this.renderCheckbox()}
            <span>Post assignments as announcements in Google Classroom</span>
          </div>
          <div className="buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            {this.renderImportButton()}
          </div>
        </div>

      </div>
    </div>)
  }
}
