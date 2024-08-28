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
  activitySessions: Student[]
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
  activitySessionDropdownCallback: () => void,
  passedStudents?: Student[],
  passedActivitySessions?: Student[]
}

const classificationKeyToHref = {
  [EVIDENCE_KEY]: "https://support.quill.org/en/articles/6070182-how-do-i-read-quill-reading-for-evidence-data-reports",
  [CONNECT_KEY]: "https://support.quill.org/en/articles/1049935-how-does-quill-grade-activities#h_3f8eef1d9d",
  [GRAMMAR_KEY]: "https://support.quill.org/en/articles/1049935-how-does-quill-grade-activities#h_664b302f5a",
  [PROOFREADER_KEY]: "https://support.quill.org/en/articles/1049935-how-does-quill-grade-activities#h_39e630b653"
}

function learnMoreLink(activityClassificationKey, activityClassificationName) {
  const href = classificationKeyToHref[activityClassificationKey]

  if (!href) { return }

  return <a href={href} rel="noopener noreferrer" target="_blank">Learn more about {activityClassificationName} scoring.</a>
}

const StudentReport = ({ params, studentDropdownCallback, activitySessionDropdownCallback, passedStudents, passedActivitySessions }) => {
  const [loading, setLoading] = React.useState(!(passedStudents && passedActivitySessions))
  const [students, setStudents] = React.useState(passedStudents || null)
  const [activitySessions, setActivitySessions] = React.useState(passedActivitySessions || null)

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (passedStudents && passedActivitySessions) { return }

    setStudents(null)
    setActivitySessions(null)

    if (isInitialMount.current) {
      isInitialMount.current = false
      getStudentData()
      getActivitySessions()
    } else {
      setLoading(true)
      getStudentData()
      getActivitySessions()
    }
  }, [params])

  React.useEffect(() => {
    if (!students || !activitySessions) { return }

    setLoading(false)
  }, [students, activitySessions])

  function selectedActivitySession(students: Student[]) {
    const { studentId, activitySessionId, } = params;

    const student = studentId ? students.find((student: Student) => student.id === parseInt(studentId)) : students[0];

    if (!activitySessionId) {
      return student
    }

    const activitySession = activitySessions.find((session: Student) => session.activity_session_id === parseInt(activitySessionId))
    return activitySession || student
  }

  function getStudentData() {
    requestGet(`/teachers/progress_reports/students_by_classroom/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}`, (data: { students: Student[] }) => {
      const { students } = data;
      setStudents(students)
    });
  }

  function getActivitySessions() {
    requestGet(`/teachers/progress_reports/finished_activity_sessions_for_student/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}/s/${params.studentId}`, (data: { activity_sessions: Student[] }) => {
      const { activity_sessions } = data;
      setActivitySessions(activity_sessions)
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
    let body = (
      <React.Fragment>
        <p>Quill employs a <b>mastery-based grading</b> system to grade activities.</p>
        <br />
        <p>Students earn:</p>
        <ul>
          <li>Proficient (‘green’) for scoring between 83%-100%.</li>
          <li>Nearly Proficient (‘yellow’) for scoring between 32%-82%.</li>
          <li>Not Proficient (‘red’) for scoring between 0%-31%.</li>
          <li>Completed (’blue’) for activities that are not graded, such as a <a href="https://support.quill.org/en/articles/2554430-what-assessments-diagnostics-and-skills-surveys-are-available-on-quill-and-who-are-they-for" rel="noopener noreferrer" target="_blank">Diagnostic</a> or <a href="https://support.quill.org/en/articles/1173157-quill-lessons-getting-started-guide" rel="noopener noreferrer" target="_blank">Quill Lesson</a>.</li>
        </ul>
        <br />
        <p>We encourage students to <a href="https://support.quill.org/en/articles/5554673-how-can-students-replay-activities" rel="noopener noreferrer" target="_blank">replay</a> their activities and <a href="https://www.quill.org/teacher-center/go-for-green">Go for Green</a> to get additional practice on skills and earn a higher grade.</p>
        <br />
        {learnMoreLink(student.activity_classification, student.activity_classification_name)}
      </React.Fragment>
    )

    if (student.activity_classification === EVIDENCE_KEY) {
      headerText = "The score for Quill Reading for Evidence activities is based on reaching a strong response on each prompt by the final attempt"
      body = (
        <React.Fragment>
          <p>Quill employs a <b>mastery-based grading</b> system to grade activities.</p>
          <br />
          <p>Students earn:</p>
          <ul>
            <li>Proficient (‘green’) for scoring between 83%-100%.</li>
            <li>Nearly Proficient (‘yellow’) for scoring between 32%-82%.</li>
            <li>Not Proficient (‘red’) for scoring between 0%-31%.</li>
            <li>Completed (’blue’) for activities that are not graded, such as a <a href="https://support.quill.org/en/articles/2554430-what-assessments-diagnostics-and-skills-surveys-are-available-on-quill-and-who-are-they-for" rel="noopener noreferrer" target="_blank">Diagnostic</a> or <a href="https://support.quill.org/en/articles/1173157-quill-lessons-getting-started-guide" rel="noopener noreferrer" target="_blank">Quill Lesson</a>.</li>
          </ul>
          <br />
          <p>For each of the three prompts, students will have five opportunities to revise their work. Their score for each prompt is based on whether they reach a strong response by the final attempt. For example, if they reach a strong response on their fourth attempt, they’ll receive full credit for that prompt.</p>
          <br />
          <p>Students will receive full credit for this activity by writing a strong response for all three prompts. They will receive partial credit for reaching a strong response on any of the three prompts.</p>
          <br />
          <p>We encourage students to <a href="https://support.quill.org/en/articles/5554673-how-can-students-replay-activities" rel="noopener noreferrer" target="_blank">replay</a> their activities and <a href="https://www.quill.org/teacher-center/go-for-green">Go for Green</a> to get additional practice on skills and earn a higher grade.</p>
          <br />
          {learnMoreLink(student.activity_classification, student.activity_classification_name)}
        </React.Fragment>
      )
    }

    if (student.activity_classification === LESSONS_KEY) {
      headerText = "Quill Lessons does not provide a score for students as there is no automated grading in the tool. Instead, the purpose of the tool is for teachers and students to collaboratively discuss answers, with feedback coming from peers rather than the automated grading and feedback that Quill provides in its independent practice tools."
      body = (
        <p>During <a href="/tools/lessons" rel="noopener noreferrer" target="_blank">Quill Lessons</a>, our tool meant for instruction with whole classes or small groups, teachers lead students through slides, and students engage with the slides by <a href="https://support.quill.org/en/articles/1173157-quill-lessons-getting-started-guide#using-the-lesson" rel="noopener noreferrer" target="_blank">responding to prompts and discussing the relevant writing skills</a>. During Quill Lessons, <b>students will not receive automatic targeted feedback on their responses</b>; however, teachers can choose to anonymously display student responses during the Quill Lesson to prompt discussion, give feedback, and encourage students to revise their answers. On the last slide of the lesson, you can assign a follow-up Quill Grammar or Quill Connect activity. Please note that although Quill Lessons are not graded, the follow-up Quill Grammar or Quill Connect activity are graded.</p>
      )
    }

    return {
      headerText,
      body
    }
  }

  if (loading) { return <LoadingSpinner /> }

  const activitySession = selectedActivitySession(students);

  const { name, score, id, time, number_of_questions, number_of_correct_questions, activity_session_id, } = activitySession;
  const displaySkills = number_of_questions ? `${number_of_correct_questions} of ${number_of_questions} ` : ''
  const displayScore = score ? `(${score}%)` : ''
  const displayTimeSpent = getTimeSpent(time)
  const studentOptions = students.map(s => ({ value: s.id, label: s.name, }))
  const studentValue = studentOptions.find(s => id === s.value)
  const activitySessionOptions = activitySessions.map((s, index) => {
    const label = `${NumberSuffix(index + 1)} Score: ${s.score}% - ${moment.utc(s.completed_at).format('MMM D[,] h:mma')}`
    return { value: s.activity_session_id, label, }
  })
  const activitySessionValue = activitySessionOptions.find(s => activity_session_id === s.value)

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
            {activitySessions.length > 1 ? <DropdownInput className="bordered sessions" handleChange={activitySessionDropdownCallback} options={activitySessionOptions} value={activitySessionValue} /> : null}
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
        {renderHelpfulTips(activitySession)}
        {studentBoxes(activitySession)}
      </div>
    </div>
  );

}

export default StudentReport;
