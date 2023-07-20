import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'underscore';

import StudentReportBox from './student_report_box.jsx';

import { QuestionData } from '../../../../../interfaces/questionData';
import { Student } from '../../../../../interfaces/student';
import { requestGet } from '../../../../../modules/request/index';
import { DropdownInput, expandIcon } from '../../../../Shared/index';
import { getTimeSpent } from '../../../helpers/studentReports';
import LoadingSpinner from '../../shared/loading_indicator.jsx';
import { CONNECT_KEY, EVIDENCE_KEY, GRAMMAR_KEY, LESSONS_KEY, } from '../constants';

const lightbulbIcon = <img alt="" src={`${process.env.CDN_URL}/images/pages/activity_analysis/lightbulb.svg`} />

export interface StudentReportState {
  boldingExplanationIsOpen: boolean,
  scoringExplanationIsOpen: boolean,
  loading: boolean,
  students: Student[],
}

interface StudentReportProps extends RouteComponentProps {
  params: {
    activityId: string,
    classroomId: string,
    studentId: string,
    unitId: string
  },
  studentDropdownCallback: () => void
}

export class StudentReport extends React.Component<StudentReportProps, StudentReportState> {

  state = {
    boldingExplanationIsOpen: false,
    scoringExplanationIsOpen: false,
    loading: true,
    students: null
  };

  componentDidMount() {
    const { params } = this.props;
    this.getStudentData(params);
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;

    if (!_.isEqual(params, prevProps.params)) {
      this.setState({ loading: true });
      this.getStudentData(params);
    }
  }

  selectedStudent = (students: Student[]) => {
    const { params } = this.props;
    const { studentId } = params;
    return studentId ? students.find((student: Student) => student.id === parseInt(studentId)) : students[0];
  }

  getStudentData = (params: StudentReportProps['params']) => {
    requestGet(`/teachers/progress_reports/students_by_classroom/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}`, (data: { students: Student[] }) => {
      const { students } = data;
      this.setState({ students, loading: false });
    });
  }

  handleToggleBoldingExplanation = () => {
    this.setState(prevState => ({ boldingExplanationIsOpen: !prevState.boldingExplanationIsOpen, }))
  }

  handleToggleScoringExplanation = () => {
    this.setState(prevState => ({ scoringExplanationIsOpen: !prevState.scoringExplanationIsOpen, }))
  }

  studentBoxes = (studentData: Student) => {
    const concept_results = _.sortBy(studentData.concept_results, 'question_number')
    return concept_results.map((question: QuestionData, index: number) => {
      return <StudentReportBox boxNumber={index + 1} key={index} questionData={question} showDiff={true} showScore={studentData.activity_classification !== EVIDENCE_KEY} />
    })
  }

  renderHelpfulTips(student) {
    return (
      <div className="helpful-tips">
        <div className="helpful-tips-header">
          {lightbulbIcon}
          <h3>Helpful Tips for Teachers <span>(Expand to show more information)</span></h3>
        </div>
        {this.renderScoringExplanation(student)}
        {this.renderBoldingExplanation()}
      </div>
    )
  }

  renderScoringExplanation(student) {
    const { scoringExplanationIsOpen, } = this.state

    let headerText = `The score for ${student.activity_classification_name} activities is based on reaching a correct response by the final attempt.`

    if (student.activity_classification === EVIDENCE_KEY) {
      headerText = "Quill Reading for Evidence does not currently provide a score to students. Quill will be introducing scoring for Reading for Evidence activities during the 2023-2024 school year."
    }

    if (student.activity_classification === LESSONS_KEY) {
      headerText = "Quill Lessons does not provide a score for students as there is no automated grading in the tool. Instead, the purpose of the tool is for teachers and students to collaboratively discuss answers, with feedback coming from peers rather than the automated grading and feedback that Quill provides in its independent practice tools."
    }

    if (scoringExplanationIsOpen) {
      return (
        <button className="toggle-student-report-explanation scoring-explanation is-open" onClick={this.handleToggleScoringExplanation} type="button">
          <img alt={expandIcon.alt} src={expandIcon.src} />
          <div>
            <h4>{headerText}</h4>
            <div className="body">
              <p>Quill employs a <b>mastery-based grading</b> system to grade activities.</p>
              <br />
              <p>Students earn:</p>
              <ul>
                <li>Proficient (‘green’) for scoring between 80-100%.</li>
                <li>Nearly Proficient (‘yellow’) for scoring between 60%-79%.</li>
                <li>Not Proficient (‘red’) for scoring between 0%-59%.</li>
                <li>Completed (’blue’) for activities that are not graded, such as a <a href="https://support.quill.org/en/articles/2554430-what-assessments-diagnostics-and-skills-surveys-are-available-on-quill-and-who-are-they-for" rel="noopener noreferrer" target="_blank">Diagnostic</a> or <a href="https://support.quill.org/en/articles/1173157-quill-lessons-getting-started-guide" rel="noopener noreferrer" target="_blank">Quill Lesson</a>.</li>
              </ul>
              <br />
              <p>Students will only see their proficiency after submitting an activity. The grade does not appear. We encourage students to <a href="https://support.quill.org/en/articles/5554673-how-can-students-replay-activities" rel="noopener noreferrer" target="_blank">replay</a> their activities and <a href="https://www.quill.org/teacher-center/go-for-green">Go for Green</a> to get additional practice on skills and earn a higher grade.</p>
            </div>
          </div>
        </button>
      )
    }

    if ([CONNECT_KEY, GRAMMAR_KEY].includes(student.activity_classification)) {
      return (
        <button className="toggle-student-report-explanation scoring-explanation is-closed" onClick={this.handleToggleScoringExplanation} type="button">
          <img alt={expandIcon.alt} src={expandIcon.src} />
          <h4>{headerText}</h4>
        </button>
      )
    }

    return (
      <div className="toggle-student-report-explanation scoring-explanation is-closed">
        <span />
        <h4>{headerText}</h4>
      </div>
    )
  }

  renderBoldingExplanation() {
    const { boldingExplanationIsOpen, } = this.state

    if (boldingExplanationIsOpen) {
      return (
        <button className="toggle-student-report-explanation is-open" onClick={this.handleToggleBoldingExplanation} type="button">
          <img alt={expandIcon.alt} src={expandIcon.src} />
          <div>
            <h4>The bolded text helps you see the edits. It is not what the student sees.</h4>
            <div className="body">
              <p>In each student response, we have bolded all of the text that was added or edited from the previous response so that you can quickly see what changed in the student’s writing throughout their revision cycle.</p>
              <br />
              <p>When your student completes an activity, Quill uses bolding to provide hints for them about what to change. In the feedback you see below, phrases like “look at the bolded word” refer to the bolding the student sees as a hint, not the bolded text displayed in this report.</p>
            </div>
          </div>
        </button>
      )
    }

    return (
      <button className="toggle-student-report-explanation is-closed" onClick={this.handleToggleBoldingExplanation} type="button">
        <img alt={expandIcon.alt} src={expandIcon.src} />
        <h4>The bolded text helps you see the edits. It is not what the student sees.</h4>
      </button>
    )
  }

  render() {
    const { studentDropdownCallback, } = this.props
    const { loading, students, } = this.state;
    if (loading) { return <LoadingSpinner /> }
    const student = this.selectedStudent(students);
    const { name, score, id, time, number_of_questions, number_of_correct_questions, } = student;
    const displaySkills = number_of_questions ? `${number_of_correct_questions} of ${number_of_questions} ` : ''
    const displayScore = score ? `(${score}%)` : ''
    const displayTimeSpent = getTimeSpent(time)
    const options = students.map(s => ({ value: s.id, label: s.name, }))
    const value = options.find(s => id === s.value)
    return (
      <div className='individual-student-activity-view white-background-accommodate-footer'>
        <div className="container">
          <header className="activity-view-header-container">
            <div className="left-side-container">
              <span>Student:</span>
              <h3 className='activity-view-header'>{name}</h3>
            </div>
            <DropdownInput handleChange={studentDropdownCallback} options={options} value={value} />
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
          {this.renderHelpfulTips(student)}
          {this.studentBoxes(student)}
        </div>
      </div>
    );
  }
}

export default StudentReport;
