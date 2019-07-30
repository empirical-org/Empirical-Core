import * as React from 'react'
import * as moment from 'moment'

// import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'
import { DataTable } from './dataTable'

import GradeOptions from './grade_options'

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
      postAssignments: !!props.user.post_google_classroom_assignments
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
    if (classrooms.every(classroom => !classroom.checked)) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  togglePostAssignments() {
    this.setState({ postAssignments: !this.state.postAssignments })
  }

  toggleRowCheck(id) {
    console.log('id', id)
    const { classrooms } = this.state
    const classroom = classrooms.find(classroom => classroom.id === id)
    console.log('classroom', classroom)
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
      return <div className="quill-checkbox selected" onClick={this.togglePostAssignments}><img src={smallWhiteCheckSrc} alt="check" /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.togglePostAssignments} />
    }
  }

  importClasses() {
    const { onSuccess, close, } = this.props
    const { classrooms, postAssignments, } = this.state
    const selectedClassrooms = classrooms.filter(classroom => classroom.checked)
    const dataForUserUpdate = {
      post_google_classroom_assignments: postAssignments,
      school_options_do_not_apply: true
    };

    requestPut('/teachers/update_my_account', dataForUserUpdate)

    requestPost('/teachers/classrooms/update_google_classrooms', { selected_classrooms: selectedClassrooms, }, (body) => {
      requestGet('/teachers/classrooms/import_google_students', () => {
        onSuccess('Classes imported')
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
        const gradeSelector = <DropdownInput
          label="Select a grade"
          className="grade"
          value={gradeOption}
          options={GradeOptions}
          handleChange={(g) => this.handleGradeChange(id, g)}
        />
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

      return <DataTable
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        checkRow={this.toggleRowCheck}
        uncheckRow={this.toggleRowCheck}
        uncheckAllRows={this.uncheckAllRows}
        checkAllRows={this.checkAllRows}
      />
    }
  }

  render() {
    const { close } = this.props
    return <div className="modal-container import-google-classrooms-modal-container">
      <div className="modal-background" />
      <div className="import-google-classrooms-modal modal">

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
            <button className={this.footerButtonClass()} onClick={this.importClasses}>Import classes</button>
          </div>
        </div>

      </div>
    </div>
  }
}
