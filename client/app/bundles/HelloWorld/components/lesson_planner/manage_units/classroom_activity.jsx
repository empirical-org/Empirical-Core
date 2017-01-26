'use strict'

import React from 'react'
import moment from 'moment';
import DatePicker from 'react-datepicker'

const styles = {
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

}

export default React.createClass({

	getInitialState: function() {
		return {
			startDate: this.props.data.due_date ? moment(this.props.data.due_date) : undefined,
		}
	},

	deleteClassroomActivity: function() {
		var x = confirm('Are you sure you want do delete this assignment?');
		if (x) {
			this.props.deleteClassroomActivity(this.props.data.id, this.props.data.unit_id);
		}
	},

	handleChange: function(date) {
		this.setState({startDate: date});
		this.props.updateDueDate(this.props.data.id, date.format());
	},

  urlForReport: function(){
    const d = this.props.data;
    return `/teachers/progress_reports/diagnostic_reports#/u/${d.unit_id}/a/${d.activity_id}/c/${d.classroom_id}/students`
  },

	finalCell: function() {
		const startDate = this.state.startDate;
		if (this.props.report) {
			return [<a key='this.props.data.activity.anonymous_path' href={this.props.data.activity.anonymous_path} target="_blank">Preview Activity</a>, <a key={this.urlForReport()} href={this.urlForReport()}>View Report</a>]
		} else {
			return <DatePicker showMonthDropdown className="due-date-input" onChange={this.handleChange} selected={startDate} placeholderText={startDate ? startDate.format('l') : 'Optional'}/>
		}
	},

  deleteRow:function(){
    if (!this.props.report) {
      return <div className="pull-right icon-x-gray" onClick={this.deleteClassroomActivity}><i className="fa fa-trash" aria-hidden="true"></i></div>
    }
  },

	render: function() {
		let url = this.props.report ? this.urlForReport() : this.props.data.activity.anonymous_path;
		return (
			<div className='row' style={styles.row}>
				<div className='cell col-md-1'>
					<div className={'pull-left icon-gray icon-wrapper ' + this.props.data.activity.classification.scorebook_icon_class}/>
				</div>
				<div className='cell col-md-8'>
					<a href={url} target='_new'>
						{this.props.data.activity.name}
					</a>
				</div>
				<div className='cell col-md-3'>
					<div style={styles.row}>
						{this.finalCell()}
						{this.deleteRow()}
					</div>
				</div>
			</div>
		);

	}
});
