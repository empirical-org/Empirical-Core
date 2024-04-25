import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'underscore';
import moment from 'moment';

import StudentReportBox from './student_report_box';

import NumberSuffix from '../../modules/numberSuffixBuilder.js';
import { QuestionData } from '../../../../../interfaces/questionData';
import { Student } from '../../../../../interfaces/student';
import { requestGet } from '../../../../../modules/request/index';
import { DropdownInput, HelpfulTips, } from '../../../../Shared/index';
import { getTimeSpent } from '../../../helpers/studentReports';
import LoadingSpinner from '../../shared/loading_indicator.jsx';
import { CONNECT_KEY, EVIDENCE_KEY, GRAMMAR_KEY, LESSONS_KEY, PROOFREADER_KEY, } from '../constants';

export interface StudentReportState {
  boldingExplanationIsOpen: boolean,
  scoringExplanationIsOpen: boolean,
  loading: boolean,
  students: Student[],
  sessions: Student[]
}

interface StudentReportProps extends RouteComponentProps {
  params: {
    activityId: string,
    classroomId: string,
    studentId: string,
    unitId: string,
    activitySessionId?: string,
  },
  studentDropdownCallback: () => void,
  sessionDropdownCallback: () => void,
  passedStudents?: Student[]
}

const StudentReport = ({ params, studentDropdownCallback, sessionDropdownCallback, passedStudents, }) => {
  const [loading, setLoading] = React.useState(!passedStudents)
  const [students, setStudents] = React.useState(passedStudents || null)
  const [sessions, setSessions] = React.useState(null)

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    setStudents(null)
    setSessions(null)

    if (isInitialMount.current) {
      isInitialMount.current = false
      getStudentData()
      getSessions()
    } else {
      setLoading(true)
      getStudentData()
      getSessions()
    }
  }, [params])

  React.useEffect(() => {
    if (!students || !sessions) { return }

    setLoading(false)
  }, [students, sessions])

  function selectedSession(students: Student[]) {
    const { studentId, activitySessionId, } = params;

    const student = studentId ? students.find((student: Student) => student.id === parseInt(studentId)) : students[0];

    if (!activitySessionId) {
      return student
    }

    const session = sessions.find((session: Student) => session.activity_session_id === parseInt(activitySessionId))
    return session || student
  }

  function getStudentData() {
    requestGet(`/teachers/progress_reports/students_by_classroom/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}`, (data: { students: Student[] }) => {
      const { students } = data;
      setStudents(students)
    });
  }

  function getSessions() {
    requestGet(`/teachers/progress_reports/sessions_for_student/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}/s/${params.studentId}`, (data: { sessions: Student[] }) => {
      const { sessions } = data;
      setSessions(sessions)
    });
  }

  function studentBoxes(studentData: Student) {
    const concept_results = _.sortBy(studentData.concept_results, 'question_number')
    return concept_results.map((question: QuestionData, index: number) => {
      return <StudentReportBox boxNumber={index + 1} key={index} questionData={question} showDiff={true} showScore={studentData.activity_classification !== EVIDENCE_KEY} />
    })
  }

  function renderHelpfulTips(student) {
    return (
      <HelpfulTips
        header={<h3>Helpful Tips for Teachers <span>(Expand to show more information)</span></h3>}
        sections={[
          scoringExplanation(student),
          {
            headerText: "The bolded text helps you see the edits. It is not what the student sees.",
            body: (
              <React.Fragment>
                <p>In each student response, we have bolded all of the text that was added or edited from the previous response so that you can quickly see what changed in the student’s writing throughout their revision cycle.</p>
                <br />
                <p>When your student completes an activity, Quill uses bolding to provide hints for them about what to change. In the feedback you see below, phrases like “look at the bolded word” refer to the bolding the student sees as a hint, not the bolded text displayed in this report.</p>
              </React.Fragment>
            ),
          },
        ]}
      />
    )
  }

  function scoringExplanation(student) {
    let headerText = `The score for ${student.activity_classification_name} activities is based on reaching a correct response by the final attempt.`

    if (student.activity_classification === EVIDENCE_KEY) {
      headerText = "Quill Reading for Evidence does not currently provide a score to students. Quill will be introducing scoring for Reading for Evidence activities during the 2023-2024 school year."
    }

    if (student.activity_classification === LESSONS_KEY) {
      headerText = "Quill Lessons does not provide a score for students as there is no automated grading in the tool. Instead, the purpose of the tool is for teachers and students to collaboratively discuss answers, with feedback coming from peers rather than the automated grading and feedback that Quill provides in its independent practice tools."
    }

    return {
      headerText,
      isDisabled: ![CONNECT_KEY, GRAMMAR_KEY, PROOFREADER_KEY].includes(student.activity_classification),
      body: (
        <React.Fragment>
          <p>Quill employs a <b>mastery-based grading</b> system to grade activities.</p>
          <br />
          <p>Students earn:</p>
          <ul>
            <li>Proficient (‘green’) for scoring between 83-100%.</li>
            <li>Nearly Proficient (‘yellow’) for scoring between 32%-82%.</li>
            <li>Not Proficient (‘red’) for scoring between 0%-31%.</li>
            <li>Completed (’blue’) for activities that are not graded, such as a <a href="https://support.quill.org/en/articles/2554430-what-assessments-diagnostics-and-skills-surveys-are-available-on-quill-and-who-are-they-for" rel="noopener noreferrer" target="_blank">Diagnostic</a> or <a href="https://support.quill.org/en/articles/1173157-quill-lessons-getting-started-guide" rel="noopener noreferrer" target="_blank">Quill Lesson</a>.</li>
          </ul>
          <br />
          <p>Students will only see their proficiency after submitting an activity. The grade does not appear. We encourage students to <a href="https://support.quill.org/en/articles/5554673-how-can-students-replay-activities" rel="noopener noreferrer" target="_blank">replay</a> their activities and <a href="https://www.quill.org/teacher-center/go-for-green">Go for Green</a> to get additional practice on skills and earn a higher grade.</p>
        </React.Fragment>
      )
    }
  }

  if (loading) { return <LoadingSpinner /> }

  const session = selectedSession(students);

  const { name, score, id, time, number_of_questions, number_of_correct_questions, activity_session_id, } = session;
  const displaySkills = number_of_questions ? `${number_of_correct_questions} of ${number_of_questions} ` : ''
  const displayScore = score ? `(${score}%)` : ''
  const displayTimeSpent = getTimeSpent(time)
  const studentOptions = students.map(s => ({ value: s.id, label: s.name, }))
  const studentValue = studentOptions.find(s => id === s.value)
  const sessionOptions = sessions.map((s, index) => {
    const label = `${NumberSuffix(index + 1)} Score: ${s.score}% - ${moment.utc(s.completed_at).format('MMM D[,] h:mma')}`
    return { value: s.activity_session_id, label, }
  })
  const sessionValue = sessionOptions.find(s => activity_session_id === s.value)

  return (
    <div className='individual-student-activity-view white-background-accommodate-footer'>
      <div className="container">
        <header className="activity-view-header-container">
          <div className="left-side-container">
            <span>Student:</span>
            <h3 className='activity-view-header'>{name}</h3>
          </div>
          <div className="dropdowns">
            <DropdownInput className="bordered" handleChange={studentDropdownCallback} options={studentOptions} value={studentValue} />
            {sessions.length > 1 ? <DropdownInput className="bordered sessions" handleChange={sessionDropdownCallback} options={sessionOptions} value={sessionValue} /> : null}
          </div>
        </header>
        <div className="time-spent-and-target-skills-count">
          <div>
            <span>Time spent:</span>
            <p>{displayTimeSpent}</p>
          </div>
          <div>
            <span>Target skills demonstrated correctly in prompts:</span>
            <p>{displaySkills}{displayScore}</p>
          </div>
        </div>
        {renderHelpfulTips(session)}
        {studentBoxes(session)}
      </div>
    </div>
  );

}

export default StudentReport;
