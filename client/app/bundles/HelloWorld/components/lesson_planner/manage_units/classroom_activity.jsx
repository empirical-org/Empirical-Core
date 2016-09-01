'use strict'

 import React from 'react'
 import moment from 'moment';

 export default  React.createClass({

  getInitialState: function(){
    return {startDate: this.dueDate(), formattedDate: this.formattedDate(this.dueDate())}
  },

  dueDate: function(){
    if (this.props.data.due_date){
      return moment(this.props.data.due_date);
    }
  },


	deleteClassroomActivity: function () {
		var x = confirm('Are you sure you want do delete this assignment?');
		if (x) {
			this.props.deleteClassroomActivity(this.props.data.id, this.props.data.unit_id);
		}
	},

  formattedDate: function(date){
    if (date) {
      return date.year() + '-' + (date.month() + 1) + '-' + (date.date() + 1);
      }
  },


  formattedForHumanDate: function(date){
    if (date) {
      return (date.month() + 1) + '-' + (date.date() + 1) +  '-' +  date.year();
      }
  },




    handleChange: function(date) {
        this.setState({startDate: date});
        // months and days are an array that start at index 0;
        var formattedDate = this.formattedDate(date)
        this.props.updateDueDate(this.props.data.id, formattedDate);
    },




	render: function () {
    let url = this.props.data.activity.anonymous_path;
    let finalCell = this.formattedForHumanDate(this.state.startDate) || 'None'
    if (this.props.type === 'report') {
      url = window.location.href
    }
		return (
			<div className='row'>
				<div className='cell col-md-1'>
					<div className={'pull-left icon-gray icon-wrapper  ' + this.props.data.activity.classification.scorebook_icon_class} />
				</div>
				<div className='cell col-md-8' >
					<a href={url} target='_new'>
						{this.props.data.activity.name}
					</a>
				</div>
				<div className='cell col-md-2'>
          {finalCell}
				</div>
				<div className="cell col-md-1">
          <div className="pull-right icon-x-gray" onClick={this.deleteClassroomActivity}></div>
				</div>
			</div>

		);

	}
});
