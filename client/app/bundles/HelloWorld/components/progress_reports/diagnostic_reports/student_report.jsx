import React from 'react'
import ProgressReport from '../progress_report.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import StudentReportBox from './student_report_box.jsx'
import ConnectStudentReportBox from './connect_student_report_box.jsx'
import $ from 'jquery'
import _ from 'underscore'
export default React.createClass({

	getInitialState: function() {
		return {loading: true, questions: null}
	},


  componentDidMount: function () {
    this.getStudentData(this.props.params)
  },

	componentWillReceiveProps(nextProps) {
		this.setState({loading: true});
		this.getStudentData(nextProps.params);
	},

	selectedStudent: function(students){
		let studentId = this.props.params.studentId;
		if (studentId) {
			return students.find(s => s.id === parseInt(studentId))
		} else {
			return students[0]
		}
	},

  getStudentData: function(params){
    const that = this;
		const p = params;
    $.get(`/teachers/progress_reports/students_by_classroom/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`, (data) => {
      that.setState({students: data.students, loading: false})
    })
  },

  studentBoxes: function(){
		const studentData = this.selectedStudent(this.state.students);
		let concept_results = _.sortBy(studentData.concept_results, 'question_number')
    return concept_results.map((question, index) => {
			if (studentData.activity_classification === 'connect') {
				return <ConnectStudentReportBox key={index} boxNumber={index+1} questionData={question}/>
			}
			return <StudentReportBox key={index} boxNumber={index+1} questionData={question}/>
		})
  },

	render: function() {
		let content;
		if (this.state.loading) {
			content = <LoadingSpinner/>
		} else {
			const student = this.selectedStudent(this.state.students);
			content = (
				<div className='individual-student-activity-view'>
					<h3 style={{marginBottom: '50px', paddingLeft: '20px'}}>{student.name}  <strong style={{paddingLeft: '20px'}}>{student.score}%</strong></h3>
          {this.studentBoxes()}
					<div className='how-we-grade'>
					<p className="title title-not-started pull-right">
						<a href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade</a>
						<a href=""><i className="fa fa-long-arrow-right"></i></a>
					</p>
					</div>
				</div>
			)
		}
		return content
	}
});
