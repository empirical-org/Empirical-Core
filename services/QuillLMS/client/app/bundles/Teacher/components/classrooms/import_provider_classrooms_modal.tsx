import * as moment from 'moment';
import * as React from 'react';

import { useState } from 'react';
import pusherInitializer from '../../../../modules/pusherInitializer';
import GradeOptions from './grade_options';

import { providerConfigLookup } from './providerHelpers'

import { requestPost } from '../../../../modules/request/index';
import { DataTable, DropdownInput } from '../../../Shared/index';
import ButtonLoadingIndicator from '../shared/button_loading_indicator';

interface ImportProviderClassroomsModalProps {
  classrooms: Array<any>;
  close: (event) => void;
  onSuccess: (event) => void;
  provider: 'Canvas' | 'Clever' | 'Google'
  user: any;
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

const ImportProviderClassroomsModal = ({classrooms: initialClassrooms, close, onSuccess, provider, user}: ImportProviderClassroomsModalProps) => {
  const [classrooms, setClassrooms] = useState(initialClassrooms);
  const [timesSubmitted, setTimesSubmitted] = useState(0);
  const [waiting, setWaiting] = useState(false);

  const providerTitle = providerConfigLookup[provider].title
  const providerClassName = providerConfigLookup[provider].className
  const importClassroomsPath = `/${providerClassName}_integration/teachers/import_classrooms`
  const importClassroomsEventName = `${providerClassName}-classroom-students-imported`
  const gradeOptions = GradeOptions

  const footerButtonClass = () => {
    let buttonClass = 'quill-button contained primary medium';
    const noClassroomsChecked = classrooms.every(classroom => !classroom.checked)
    if (noClassroomsChecked) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  const toggleRowCheck = (rowId) => {
    const updatedClassrooms = classrooms.map(classroom => {
      if (classroom.classroom_external_id === rowId) { classroom.checked = !classroom.checked }

      return classroom
    })

    setClassrooms(updatedClassrooms)
  }

  const checkAllRows = () => {
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = true
      return classroom
    })
    setClassrooms(newClassrooms)
  }

  const uncheckAllRows = () => {
    const newClassrooms = classrooms.map(classroom => {
      classroom.checked = false
      return classroom
    })
    setClassrooms(newClassrooms)
  }

  const handleClickImportClasses = () => {
    const classroomsCheckedWithNoGrade = classrooms.filter(classroom => classroom.checked && !classroom.grade)

    if (classroomsCheckedWithNoGrade.length) {
      const newClassrooms = classrooms.map(c => {
        if (classroomsCheckedWithNoGrade.find(noGradeClassroom => noGradeClassroom.id === c.id)) {
          c.error = 'Select a grade for your class'
        }
        return c
      })

      setClassrooms(newClassrooms);
      setTimesSubmitted(prevTimes => prevTimes + 1);
      return
    }

    setWaiting(true)
    const selectedClassrooms = classrooms.filter(classroom => classroom.checked)

    pusherInitializer(user.id, importClassroomsEventName, () => onSuccess('Classes imported'))
    requestPost(importClassroomsPath, { selected_classrooms: selectedClassrooms })
  }

  const handleGradeChange = (rowId: string, grade: HTMLInputElement) => {
    const updatedClassrooms = classrooms.map(classroom => {
      if (classroom.classroom_external_id === rowId) { classroom.grade = grade.value }

      return classroom
    })

    setClassrooms(updatedClassrooms)
  }

  const renderModalContent = () => {
    if (!classrooms.length) { return }

    const rows = classrooms.map(classroom => {
      const { name, username, classroom_external_id, creationTime, studentCount, checked, grade, error } = classroom
      const year = moment(creationTime).format('YYYY')
      const gradeOption = GradeOptions.find(g => [grade, Number(grade)].includes(g.value))
      const gradeSelector = (
        <DropdownInput
          className="grade"
          error={error && !grade ? error : null}
          handleChange={(g) => handleGradeChange(classroom_external_id, g)}
          label="Select a grade"
          options={gradeOptions}
          timesSubmitted={timesSubmitted}
          value={gradeOption}
        />
      )

      return {
        id: classroom_external_id,
        name,
        username,
        checked,
        year,
        className: error && !grade ? 'error' : '',
        grade: checked ? gradeSelector : null,
        students: studentCount,
        key: classroom_external_id,
      }
    })

    return (
      <DataTable
        checkAllRows={checkAllRows}
        checkRow={toggleRowCheck}
        headers={headers}
        rows={rows}
        showCheckboxes={true}
        uncheckAllRows={uncheckAllRows}
        uncheckRow={toggleRowCheck}
      />
    )
  }

  const renderImportButton = () => {
    if (waiting) {
      return (
        <button
          aria-label="Loading"
          className={footerButtonClass()}
          type="button"
        >
          <ButtonLoadingIndicator />
        </button>

      )
    } else {
      return (
        <button
          className={footerButtonClass()}
          onClick={handleClickImportClasses}
          type="button"
        >
          Import classes
        </button>
      )
    }
  }

  return (
    <div className="modal-container import-provider-classrooms-modal-container">
      <div className="modal-background" />
      <div className="import-provider-classrooms-modal quill-modal">

        <div className="import-provider-classrooms-modal-header">
          <h3 className="title">Import classes from {providerTitle}</h3>
        </div>

        <div className="import-provider-classrooms-modal-body modal-body">
          {renderModalContent()}
        </div>

        <div className="import-provider-classrooms-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">Cancel</button>
            {renderImportButton()}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ImportProviderClassroomsModal
