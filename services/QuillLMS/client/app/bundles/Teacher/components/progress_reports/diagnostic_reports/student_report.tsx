import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'underscore';

import ConnectStudentReportBox from './connect_student_report_box.jsx';
import StudentReportBox from './student_report_box';

import { QuestionData } from '../../../../../interfaces/questionData';
import { Student } from '../../../../../interfaces/student';
import { requestGet } from '../../../../../modules/request/index';
import { DropdownInput, expandIcon } from '../../../../Shared/index';
import { getTimeSpent } from '../../../helpers/studentReports';
import LoadingSpinner from '../../shared/loading_indicator.jsx';
import { CONNECT_KEY, EVIDENCE_KEY, GRAMMAR_KEY } from '../constants';

export interface StudentReportState {
  boldingExplanationIsOpen: boolean,
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

  studentBoxes = (studentData: Student) => {
    const concept_results = _.sortBy(studentData.concept_results, 'question_number')
    return concept_results.map((question: QuestionData, index: number) => {
      if ([GRAMMAR_KEY, CONNECT_KEY, EVIDENCE_KEY].includes(studentData.activity_classification)) {
        return <ConnectStudentReportBox boxNumber={index + 1} key={index} questionData={question} showDiff={true} showScore={studentData.activity_classification !== EVIDENCE_KEY} />
      }
      return <StudentReportBox boxNumber={index + 1} key={index} questionData={question} />
    })
  }

  renderBoldingExplanation(studentData) {
    const { boldingExplanationIsOpen, } = this.state

    if (![GRAMMAR_KEY, CONNECT_KEY, EVIDENCE_KEY].includes(studentData.activity_classification)) { return }

    if (boldingExplanationIsOpen) {
      return (
        <button className="toggle-explanation is-open" onClick={this.handleToggleBoldingExplanation} type="button">
          <div>
            <h3>The bolded text helps you see the edits. It is not what the student sees.</h3>
            <p>In each student response, we have bolded all of the text that was added or edited from the previous response so that you can quickly see what changed in the student’s writing throughout their revision cycle.</p>
            <p>When your student completes an activity, Quill uses bolding to provide hints for them about what to change. In the feedback you see below, phrases like “look at the bolded word” refer to the bolding the student sees as a hint, not the bolded text displayed in this report.</p>
          </div>
          <img alt={expandIcon.alt} src={expandIcon.src} />
        </button>
      )
    }

    return (
      <button className="toggle-explanation is-closed" onClick={this.handleToggleBoldingExplanation} type="button">
        <div>
          <h3>The bolded text helps you see the edits. It is not what the student sees.</h3>
          <p>(Expand to show more information)</p>
        </div>
        <img alt={expandIcon.alt} src={expandIcon.src} />
      </button>
    )
  }

  render() {
    const { studentDropdownCallback, } = this.props
    const { loading, students, } = this.state;
    if (loading) { return <LoadingSpinner /> }
    const student = this.selectedStudent(students);
    const { name, score, id, time } = student;
    const displayScore = score ? `${score}%` : ''
    const displayTimeSpent = getTimeSpent(time)
    const options = students.map(s => ({ value: s.id, label: s.name, }))
    const value = options.find(s => id === s.value)
    return (
      <div className='individual-student-activity-view'>
        <header className="activity-view-header-container">
          <div className="left-side-container">
            <h3 className='activity-view-header'>{name}</h3>
            <div className="score-time-spent-container">
              <p className='activity-view-score'>{`Score: ${displayScore}`}</p>
              <p className='activity-time-spent'>{`Time spent: ${displayTimeSpent}`}</p>
            </div>
          </div>
          <DropdownInput handleChange={studentDropdownCallback} options={options} value={value} />
        </header>
        {this.renderBoldingExplanation(student)}
        {this.studentBoxes(student)}
        <div className='how-we-grade'>
          <p className="title title-not-started pull-right">
            <a href="https://support.quill.org/activities-implementation/how-does-grading-work" rel='noreferrer noopener' target="_blank" >How We Grade <i className="fas fa-long-arrow-alt-right" /></a>
          </p>
        </div>
      </div>
    );
  }
}

export default StudentReport;
