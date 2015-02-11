EC.ClassroomActivity = React.createClass({

	componentDidMount: function () {
		$(this.refs.dueDate.getDOMNode()).datepicker({
	    	selectOtherMonths: true,
	      	dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	      	minDate: -20,
	      	maxDate: "+1M +10D",
	      	dateFormat: "mm-dd-yy",
	      	altField: ('#railsFormatDate' + this.props.data.id),
	      	altFormat: 'yy-mm-dd',
	      	onSelect: this.handleChange
	    });
    
	},


	deleteClassroomActivity: function () {
		var x = confirm("Are you sure you want do delete this assignment?")
		if (x) {
			this.props.deleteClassroomActivity(this.props.data.id, this.props.data.unit_id)
		}
	},

	handleChange: function () {
	    var x1 = '#railsFormatDate' + this.props.data.id;
	    var dom = $(x1);
	    var val = dom.val();
	    console.log('date', val)
	    this.props.updateDueDate(this.props.data.id, val);
	},

	render: function () {

		return (
			<tr className="row">
				<td className="col-md-1">
					<div className={"pull-left icon-gray icon-wrapper  " + this.props.data.activity.classification.scorebook_icon_class} />
				</td>
				
				<td className="col-md-8" >
					{this.props.data.activity.name}
				</td>
				
				<td className="col-md-2">
					<input type="text" value={this.props.data.formatted_due_date} ref="dueDate" className="datepicker-input" placeholder="mm/dd/yyyy" />
					<input type="text"  className="railsFormatDate" id={"railsFormatDate" + this.props.data.id} ref="railsFormatDate" />
				</td>
				<td className="col-md-1 icon-x-gray" onClick={this.deleteClassroomActivity}>
				</td>
			</tr>

		);
	}

});



  
