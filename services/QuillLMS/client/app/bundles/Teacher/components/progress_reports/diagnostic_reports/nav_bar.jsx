import React from 'react';
import { DropdownInput } from 'quill-component-library/dist/componentLibrary';
import $ from 'jquery';

import { requestGet } from '../../../../../modules/request/index';

const recommendationsButton = ({ isDiagnostic, buttonGroupCallback, }) => {
  const identifier = 'recommendations'
  if (!isDiagnostic) { return }
  const className = window.location.href.includes(identifier) && 'active'
  const handleClick = () => buttonGroupCallback(identifier)
  return <button className={className} onClick={handleClick} type="button">Recommendations</button>
}

const studentsButton = ({ buttonGroupCallback, }) => {
  const identifier = 'students'
  const className = window.location.href.includes(identifier) && 'active'
  const handleClick = () => buttonGroupCallback(identifier)
  return <button className={className} onClick={handleClick} type="button">Student reports</button>
}

const questionsButton = ({ buttonGroupCallback, }) => {
  const identifier = 'questions'
  const className = window.location.href.includes(identifier) && 'active'
  const handleClick = () => buttonGroupCallback(identifier)
  return <button className={className} onClick={handleClick} type="button">Questions reports</button>
}

const Navbar = ({ params, selectedActivity, classrooms, buttonGroupCallback, }) => {
  const [isDiagnostic, setIsDiagnostic] = React.useState<boolean>(false);

  React.useEffect(() => {
    getDiagnosticActivityIds();
  }, []);

  const getDiagnosticActivityIds = () => {
    requestGet('/teachers/progress_reports/diagnostic_activity_ids',
      (data) => {
        const { diagnosticActivityIds, } = data
        const { activityId, } = params
        const isDiagnosticActivity = diagnosticActivityIds.includes(Number(activityId))
        setIsDiagnostic(isDiagnosticActivity)
        if (isDiagnosticActivity) {
          $('.activity-analysis-tab').removeClass('active');
          $('.diagnostic-tab').addClass('active');
        } else {
          $('.diagnostic-tab').removeClass('active');
          $('.activity-analysis-tab').addClass('active');
        }
      }
    )
  }

  const classroomOptions = classrooms.map(classroom => ({ value: classroom.id, label: classroom.name, }))

  const onDropdownChange = (val) => {
    debugger;
  }

  return (<header className="reports-header">
    <div className="container">
      <div className="name-and-classroom-dropdown">
        <h1>{selectedActivity.name}</h1>
        <DropdownInput handleChange={onDropdownChange} options={classroomOptions} value={classroomOptions.find(opt => String(opt.value) === params.classroomId)} />
      </div>
      <nav>
        {recommendationsButton({ isDiagnostic, buttonGroupCallback, })}
        {studentsButton({ buttonGroupCallback, })}
        {questionsButton({ buttonGroupCallback, })}
      </nav>
    </div>
  </header>)
}

export default Navbar
