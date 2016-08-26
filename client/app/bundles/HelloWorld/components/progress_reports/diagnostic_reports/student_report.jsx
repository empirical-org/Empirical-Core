import React from 'react'
import ProgressReport from '../progress_report.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import StudentReportBox from './student_report_box.jsx'
import $ from 'jquery'
export default React.createClass({

	propTypes: {
		// source: React.PropTypes.string.isRequired,
		// studentId: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {loading: true, questions: null}
	},

  componentDidMount: function () {
    this.getStudentData()
  },

	selectedStudent: function(students){
		let query = this.props.params.query
		if (query && query.studentId) {
			return students.find(s => s.id === parseInt(query.studentId))
		} else {
			return students[0]
		}
	},

  getStudentData: function(){
    const that = this;
    $.get('/teachers/progress_reports/students_by_classroom/' + that.props.classroom, (data) => {
      // that.setState({questions: data.students[0].session.concept_results, loading: false})
      that.setState({students: data.students, selectedStudent: this.selectedStudent(data.students), loading: false})
    })
  },

  studentBoxes: function(){
		let concept_results = this.state.selectedStudent.session.concept_results
    return concept_results.map((question, index) => <StudentReportBox key={index} boxNumber={index+1} questionData={question}/>)
  },

	render: function() {
		let content;
		if (this.state.loading) {
			content = <LoadingSpinner/>
		} else {
			content = (
				<div id='individual-student-activity-view'>
          {this.studentBoxes()}
				</div>
			)
		}
		return content
	}
});
