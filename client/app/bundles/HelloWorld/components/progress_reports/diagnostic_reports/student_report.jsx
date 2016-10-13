import React from 'react'
import ProgressReport from '../progress_report.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import StudentReportBox from './student_report_box.jsx'
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
		let {studentId} = this.props.params;
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
		let concept_results = _.sortBy(this.selectedStudent(this.state.students).concept_results, 'question_number')
    return concept_results.map((question, index) => {
			return <StudentReportBox key={index} boxNumber={index+1} questionData={question}/>
		})
  },

	render: function() {
		let content;
		if (this.state.loading) {
			content = <LoadingSpinner/>
		} else {
			content = (
				<div className='individual-student-activity-view'>
          {this.studentBoxes()}
					<div className='how-we-grade'>
					<p className="title title-not-started pull-right">
						<a href="http://support.quill.org/knowledgebase/articles/545071-how-we-grade">How We Grade</a>
						<a href=""><i className="fa fa-long-arrow-right"></i></a>
					</p>
					</div>
				</div>
			)
		}
		return content
	}
});
