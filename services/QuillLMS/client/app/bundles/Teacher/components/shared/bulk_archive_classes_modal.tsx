import * as moment from 'moment';
import * as React from 'react';

import { DataTable } from '../../../Shared/index';

import { requestPost } from '../../../../modules/request/index';
import GradeOptions from '../classrooms/grade_options';

const headers = [
  {
    width: '530px',
    name: 'Class',
    attribute: 'name'
  }, {
    width: '64px',
    name: 'Grade',
    attribute: 'grade'
  }, {
    width: '88px',
    name: 'Created',
    attribute: 'created'
  }, {
    width: '51px',
    name: 'Students',
    attribute: 'students',
    rowSectionClassName: "students-row-section",
    headerClassName: 'students-header'
  }
]

const ModalContent = ({ classes, selectedClassroomIds, setSelectedClassroomIds, }) => {
  const checkAllRows = () => {
    const allIds = classes.map(c => c.id)
    setSelectedClassroomIds(allIds)
  }

  const uncheckAllRows = () => {
    setSelectedClassroomIds([])
  }

  const toggleRowCheck = (id) => {
    if (selectedClassroomIds.includes(id)) {
      setSelectedClassroomIds(selectedClassroomIds.filter(i => i !== id))
    } else {
      setSelectedClassroomIds(selectedClassroomIds.concat([id]))
    }
  }
  const rows = classes.sort((a, b) => a.created_at - b.created_at).map(classroom => {
    const { name, id, created_at, student_count, grade, error, students } = classroom
    const gradeOption = GradeOptions.find(g => [grade, Number(grade)].includes(g.value))
    return {
      name,
      id,
      checked: selectedClassroomIds.includes(id),
      grade: gradeOption ? gradeOption.label : 'Other',
      created: moment(created_at).format('MMM D, YYYY'),
      students: student_count || students.length
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

const BulkArchiveClassesModal = ({ classes, onCloseModal, onSuccess, }) => {
  const [selectedClassroomIds, setSelectedClassroomIds] = React.useState([])

  let footerButtonClass = 'quill-button contained primary medium'
  footerButtonClass+= selectedClassroomIds.length ? '' : ' disabled'

  const handleClickArchiveClasses = () => {
    requestPost('/teachers/classrooms/bulk_archive', { ids: selectedClassroomIds }, () => {
      const snackbarText = selectedClassroomIds.length === 1 ? 'Class archived' : 'Classes archived'
      onSuccess(snackbarText)
      onCloseModal()
    })
  }

  return (
    <div className="modal-container bulk-archive-classes-modal-container">
      <div className="modal-background" />
      <div className="bulk-archive-classes-modal quill-modal">

        <div className="bulk-archive-classes-modal-header">
          <h3 className="title">Choose classes to archive</h3>
          <p>If you archive classes, students in those classes will no longer be able to access activities. You can view archived classes under the &quot;Classes&quot; tab.</p>
          <a href="https://support.quill.org/en/articles/4177342-how-to-archive-classes-tips-and-tricks">Learn more about archiving classes</a>
        </div>

        <div className="bulk-archive-classes-modal-body modal-body">
          <ModalContent classes={classes} selectedClassroomIds={selectedClassroomIds} setSelectedClassroomIds={setSelectedClassroomIds} />
        </div>

        <div className="bulk-archive-classes-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium" onClick={onCloseModal} type="button">Cancel</button>
            <button className={footerButtonClass} onClick={handleClickArchiveClasses} type="button">Archive</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BulkArchiveClassesModal
