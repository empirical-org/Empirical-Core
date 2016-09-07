import React from 'react'
import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router'
import NumberSuffix from '../../modules/numberSuffixBuilder.js'
import Modal from 'react-bootstrap/lib/Modal';
import CreateClass from '../../../containers/CreateClass.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'

export default React.createClass({

	componentDidMount: function() {
		this.getClassrooms()
	},

	getInitialState: function() {
		return ({loading: true, classrooms: null, show: false, hidden: true})
	},

	getClassrooms: function() {
		var that = this;
		$.ajax('/teachers/classrooms/classrooms_i_teach').done(function(data) {
			let classrooms = that.addCheckedProp(data.classrooms);
			that.setState({classrooms: classrooms})
		}).fail(function() {
			alert('error');
		}).always(function() {
			that.setState({loading: false})
		});
	},

	classroomsSelected: function() {
		let classrooms = [];
		this.state.classrooms.forEach((c) => {
			if (c.checked) {
				classrooms.push({'id': c.id, 'student_ids': []})
			}
		})
		return classrooms;
	},

	assignedClassData: function() {
		return ({
			unit: {
				name: 'Diagnostic',
				classrooms: this.classroomsSelected(),
				activities: [
					{
						id: 413
					}
				]
			}
		})
	},

	submitClasses: function() {
		this.setState({disabled: true})
		let data = this.assignedClassData();
		if (data.unit.classrooms.length < 1) {
			alert('You must select a classroom before assigning the diagnostic.')
		} else {
			$.ajax({type: 'POST', url: '/teachers/units', data: JSON.stringify(data), dataType: 'json', contentType: 'application/json'})
			.done(function() {
				window.location = '/diagnostic#/success'
			})
			.fail(function() {
				alert('There has been an error assigning the lesson. Please make sure you have selected a classroom');
			})
		}
	},

	grades: function() {
		let grades = []
		for (let grade = 1; grade <= 12; grade++) {
			grades.push(
				<MenuItem key={grade} eventKey={grade}>{this.readingLevelFormatter(grade)}</MenuItem>
			)
		}
		return grades
	},

	addCheckedProp: function(classrooms) {
		let updatedClassrooms = classrooms.map((classy) => {
			classy.checked = false
			return classy
		})
		return updatedClassrooms
	},

	readingLevelFormatter: function(num) {
		return num
			? NumberSuffix(num) + ' grade reading level'
			: null
	},

	handleSelect: function(index, grade) {
		let updatedClassrooms = this.state.classrooms.slice(0);
		updatedClassrooms[index].selectedGrade = grade
		this.setState({classrooms: updatedClassrooms})
	},

	handleChange: function(index) {
		let updatedClassrooms = this.state.classrooms.slice(0);
		updatedClassrooms[index].checked = !updatedClassrooms[index].checked;
		this.setState({
			classrooms: updatedClassrooms,
			hidden: this.classroomsSelected.length > 0
		})
	},

	buildClassRow: function(classy, index) {
		// The commented out portions are so we can add the reading level once we bring back that feature
		const currClass = this.state.classrooms[index]
		let that = this
		// let readingLevel = function() {
		// 	let input = currClass.selectedGrade || classy.grade || 'Select a Reading Level'
		// 	return input === 'Select a Reading Level'
		// 		? input
		// 		: that.readingLevelFormatter(input)
		// }
		return (
			<div className='classroom-row' key={classy.id}>
				<div className='pull-left'>
					<input type='checkbox' id={classy.name} className='css-checkbox' value='on' onChange={() => this.handleChange(index)}/>
					<label htmlFor={classy.name} id={classy.name} className='css-label'>
						<h3>{classy.name}</h3>
					</label>
				</div>
				<div className={'is-checked-' + currClass.checked}>
					{/*<DropdownButton bsStyle='default' title={readingLevel()} id='select-grade' onSelect={this.handleSelect.bind(null, index)}>
						{this.grades()}
					</DropdownButton>*/}
					{/*<a href='/'>Preview</a>*/}
				</div>
			</div>
		)
	},

	classroomTable: function() {
		if (this.state.loading) {
			//return loading image
		} else if (this.state.classrooms === [] || null) {
			return <span></span>
		} else {
			let rows = this.state.classrooms.map((classy, index) => this.buildClassRow(classy, index));
			return <div id='classroom-table-wrapper'>{rows}</div>
		}
	},

	showModal() {
		this.setState({show: true});
	},

	hideModal(becauseClassAdded) {
		if (becauseClassAdded) {
			this.getClassrooms()
		}
		this.setState({show: false});
	},

	modal() {
		return (
			<Modal {...this.props} show={this.state.show} onHide={this.hideModal} dialogClassName='add-class-modal'>
				<Modal.Body>
					<img className='pull-right react-bootstrap-close' onClick={this.hideModal} src='images/close_x.svg' alt='close-modal'/>
					<CreateClass closeModal={this.hideModal}/>
				</Modal.Body>
			</Modal>
		)
	},

	render: function() {
		let content = this.state.loading
			? <LoadingSpinner/>
			: this.classroomTable()
		let display = {
			display: this.state.hidden
				? 'none'
				: null
		}
		return (
			<div id='assign-page'>
				<div>
					<h2>Which classes would you like to assign the diagnostic to?</h2>
					<span id='subtext'>Students will be able to complete the diagnostic once they join a class.</span>
					{/*<a href='/placeholder'>How should I determine the reading level of my classes?</a>*/}
				</div>
				{content}
				<div id='footer-buttons'>
					<div className='pull-left text-center'>
						<button className='button button-transparent' onClick={this.showModal}>Add a Class</button>
						{this.modal()}
					</div>
					<div className='pull-right text-center'>
						<button style={display} onClick={this.submitClasses} className='button-green'>Save & Assign</button>
						<br/>
						<Link to='/stage/2'>Back</Link>
					</div>
				</div>
			</div>
		)
	}
});
