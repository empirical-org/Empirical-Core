import * as React from 'react';
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import StudentReportBox from './student_report_box'
import ConnectStudentReportBox from './connect_student_report_box.jsx'
import _ from 'underscore'
import { RouteComponentProps } from 'react-router-dom';
import Student from '../../../../interfaces/student';
import QuestionData from '../../../../interfaces/questionData';
import { requestGet } from '../../../../../modules/request/index.js';

export interface StudentReportState {
  loading: boolean,
  students: Student[],
}

export class StudentReport extends React.Component<RouteComponentProps, StudentReportState> {

  state = {
    loading: true,
    students: null
  };

  componentDidMount() {
    const { params } = this.props;
    this.getStudentData(params);
  }

  componentWillReceiveProps(nextProps: RouteComponentProps) {
    const { params } = nextProps;
    this.setState({ loading: true });
    this.getStudentData(params);
  }

  selectedStudent = (students: Student[]) => {
    const { params } = this.props;
    const { studentId } = params;
      return studentId ? students.find((student: Student) => student.id === parseInt(studentId)) : students[0];
  }

  getStudentData = (params: RouteComponentProps['params']) => {
    requestGet(`/teachers/progress_reports/students_by_classroom/u/${params.unitId}/a/${params.activityId}/c/${params.classroomId}`, (data: { students: Student[] }) => {
      const { students } = data;
      this.setState({ students, loading: false });
    });
  }

  studentBoxes = (students: Student[]) => {
    const studentData = this.selectedStudent(students);
    const concept_results = _.sortBy(studentData.concept_results, 'question_number')
    return concept_results.map((question: QuestionData, index: number) => {
      if (studentData.activity_classification === 'connect' || studentData.activity_classification === 'sentence') {
        return <ConnectStudentReportBox boxNumber={index + 1} key={index} questionData={question} />
      }
      return <StudentReportBox boxNumber={index + 1} key={index} questionData={question} />
    })
  }

  render() {
    const { studentDropdownCallback, } = this.props
    const { loading, students, } = this.state;
    if (loading) { return <LoadingSpinner /> }
    const student = this.selectedStudent(students);
    const { name, score, id } = student;
    const options = students.map(s => ({ value: s.id, label: s.name, }))
    const value = options.find(s => id === s.value)
    return (
      <div className='individual-student-activity-view'>
        <header className="activity-view-header-container">
          <h3 className='activity-view-header'>{name}  <strong className='activity-view-score'>{score}%</strong></h3>
          <DropdownInput handleChange={studentDropdownCallback} options={options} value={value} />
        </header>
        {this.studentBoxes(students)}
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
