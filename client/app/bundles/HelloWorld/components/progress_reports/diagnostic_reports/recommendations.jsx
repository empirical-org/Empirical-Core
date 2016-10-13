import React from 'react'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import _ from "underscore"

export default React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			recommendations: [],
			selections: [],
			students: [],
			assigning: false,
			assigned: false
		}
	},

	componentDidMount: function() {
		this.getRecommendationData(this.props.params.classroomId);
	},

	componentWillReceiveProps(nextProps) {
		this.setState({loading: true});
		this.getRecommendationData(nextProps.params.classroomId);
	},

	getRecommendationData: function(classroomId){
		var that = this;
		$.get('/teachers/progress_reports/recommendations_for_classroom/' + classroomId, (data) => {
			that.setState({
				recommendations: JSON.parse(JSON.stringify(data.recommendations)),
				selections: [...data.recommendations],
				students: data.students,
				loading: false
			})
		})
	},

	studentIsSelected: function(student, selection) {
		return (_.indexOf(selection.students, student.id) != -1)
	},

	studentIsRecommended: function(student, recommendation) {
		return (_.indexOf(recommendation.students, student.id) != -1)
	},

	toggleSelected: function(student, index) {
		const selections = [...this.state.selections]
		if (this.studentIsSelected(student, selections[index])) {
			selections[index].students = _.reject(selections[index].students, (stud) => stud === student.id)
		} else {
			selections[index].students.push(student.id)
		}
		this.setState({selections: selections})
	},

	assignSelectedPacks: function() {
		this.setState({assigning: true})
		const classroomId = this.props.params.classroomId;
		const selections = this.state.selections.map((activityPack) => {
			return {id: activityPack.activity_pack_id, student_ids: activityPack.students}
		})
		$.post('/teachers/progress_reports/assign_selected_packs/' + classroomId, {
			selections
		}, (data) => {
			this.setState({assigning: false, assigned: true})
		})
	},

	renderExplanation: function() {
		return (
			<div className='recommendations-explanation-container'>
				<p className="recommendations-explanation">
					Based on the results of the diagnostic, we created a personalized learning plan for each student.
					<br/>Customize your learning plan by selecting the activity packs you would like to assign.
				</p>
			</div>
		)
	},

	renderTopBar: function() {
		return (
			<div className="recommendations-top-bar">
				<div className="recommendations-key">
					<div className="recommendations-key-icon"></div>
					<p>Recommended Activity Packs</p>
				</div>
				{this.renderAssignButton()}
			</div>
		)
	},

	renderAssignButton: function() {
		if (this.state.assigning) {
			return (
				<div className="recommendations-assign-button">
					<span>Assigning...</span>
				</div>
			)
		} else if (this.state.assigned) {
			return (
				<div className="recommendations-assign-button">
					<span>Assigned</span>
				</div>
			)
		} else {
			return (
				// <div className="recommendations-assign-button" onClick={() => this.assignSelectedPacks()}>
				<div className="recommendations-assign-button" onClick={() => alert('Activity Packs are under development, and they will be unlocked in 2-3 weeks.')}>
					<span>Assign Activity Packs</span>
				</div>
			)
		}
	},

	renderTableHeader: function() {
		return (
			<div className="recommendations-table-header">
				<div className="recommendations-table-header-name">Name</div>
				{this.renderActivityPackHeaderItems()}
			</div>
		)
	},

	renderActivityPackHeaderItems: function() {
		return this.state.recommendations.map((recommendation) => {
			return (
				<div className="recommendations-table-header-item" key={recommendation.activity_pack_id}>
					<p>{recommendation.name}</p>
					<a href={"/activities/packs/" + recommendation.activity_pack_id} target="_blank">View Pack</a>
				</div>
			)
		})
	},

	renderTableRows: function() {
		return this.state.students.map((student) => {
			return this.renderTableRow(student)
		})
	},

	renderTableRow: function(student) {
		return (
			<div className="recommendations-table-row" key={student.id}>
				<div className="recommendations-table-row-name">{student.name}</div>
				{this.renderActivityPackRowItems(student)}
			</div>
		)
	},

	renderActivityPackRowItems: function(student) {
		return this.state.recommendations.map((recommendation, i) => {
			let selection = this.state.selections[i];
			const recommended = this.studentIsRecommended(student, recommendation)
				? " recommended "
				: "";
			const selected = this.studentIsSelected(student, selection)
				? " selected "
				: "";
			return (
				<div className={"recommendations-table-row-item" + recommended + selected} key={recommendation.activity_pack_id}>
					<div className="recommendations-table-row-item-checkbox" onClick={this.toggleSelected.bind(null, student, i)}>
						{this.renderSelectedCheck(student, selection)}
					</div>
					<p>{recommendation.name}</p>
				</div>
			)
		})
	},

	renderSelectedCheck: function(student, selection) {
		if (this.studentIsSelected(student, selection)) {
			return (
				<img className="recommendation-check" src="/images/recommendation_check.svg"></img>
			)
		}
	},

	renderBottomBar: function() {
		return (
			<div className="recommendations-bottom-bar">
				{this.renderAssignButton()}
			</div>
		)
	},

	render: function() {
		if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return (
				<div>
					{this.renderExplanation()}
					<div className="recommendations-container">
						{this.renderTopBar()}
						{this.renderTableHeader()}
						<div className="recommendations-table-row-wrapper">
      				{this.renderTableRows()}
      			</div>
						{this.renderBottomBar()}
					</div>
				</div>
			)
		}

	}

})
