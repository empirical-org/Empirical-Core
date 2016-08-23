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

  getStudentData: function(){
    const that = this;
    $.get('/teachers/progress_reports/students_by_classroom/' + that.props.classroom, (data) => {
      that.setState({questions: data.students[0].session.concept_results, loading: false})
    })
    //
  },

  mockData: function(){
    return [{directions: 'Combine the two sentences below into one sentence using one of the words in parentheses. (although, and, so)',
      prompt: 'The sky turned grey. The rain started. The game was canceled.',
      score: 100,
      answer: 'The sky turned grey, then the rain started and the game was canceled.',
      concepts: [{id: 12232, correct: true, name: 'Punctuate Complex Sentence (beginning)'},
                {id: 1222232, correct: false, name: 'Identify Fragments and Sentences'}]
    }]
  },


  studentBoxes: function(){
    // return this.state.questions.map((question, index) => <StudentReportBox key={index} boxNumber={index+1} questionData={question}/>)
    return this.mockData().map((question, index) => <StudentReportBox key={index} boxNumber={index+1} questionData={question}/>)
  },

	render: function() {
		let content;
		// if (this.state.loading) {
		// 	content = <LoadingSpinner/>
		// } else {
			content = (
				<div id='individual-student-activity-view'>
          {this.studentBoxes()}
				</div>
			)
		// }
		return content
	}
});
