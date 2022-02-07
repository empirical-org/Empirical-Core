import React from 'react';
import $ from 'jquery';

import { DropdownInput } from '../../../../Shared/index';
import { requestGet } from '../../../../../modules/request/index';

const studentsButton = ({ buttonGroupCallback, }) => {
  const identifier = 'students'
  const className = (window.location.href.includes(identifier) || window.location.href.includes('student_report')) && 'active'
  const handleClick = () => buttonGroupCallback(identifier)
  return <button className={className} onClick={handleClick} type="button">Student reports</button>
}

const questionsButton = ({ buttonGroupCallback, }) => {
  const identifier = 'questions'
  const className = window.location.href.includes(identifier) && 'active'
  const handleClick = () => buttonGroupCallback(identifier)
  return <button className={className} onClick={handleClick} type="button">Questions reports</button>
}

const Navbar = ({ params, selectedActivity, classrooms, buttonGroupCallback, dropdownCallback, }) => {
  const [isDiagnostic, setIsDiagnostic] = React.useState(false);

  React.useEffect(() => {
    $('.diagnostic-tab').removeClass('active');
    $('.activity-analysis-tab').addClass('active');
  }, []);

  const classroomOptions = classrooms.map(classroom => ({ value: classroom.id, label: classroom.name, }))

  const onDropdownChange = (classroomOption) => {
    const selectedClassroom = classrooms.find(c => c.id === classroomOption.value)
    dropdownCallback(selectedClassroom)
  }

  return (
    <header className="reports-header">
      <div className="container">
        <div className="name-and-classroom-dropdown">
          <h1>{selectedActivity.name}</h1>
          <DropdownInput handleChange={onDropdownChange} options={classroomOptions} value={classroomOptions.find(opt => String(opt.value) === params.classroomId)} />
        </div>
        <nav>
          {studentsButton({ buttonGroupCallback, })}
          {questionsButton({ buttonGroupCallback, })}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
