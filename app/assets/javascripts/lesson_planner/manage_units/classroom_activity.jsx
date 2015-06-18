"use strict";
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
		var x = confirm("Are you sure you want do delete this assignment?");
		if (x) {
			this.props.deleteClassroomActivity(this.props.data.id, this.props.data.unit_id);
		}
	},

	handleChange: function () {
	    var x1, dom, val;
	    x1 = '#railsFormatDate' + this.props.data.id;
	    dom = $(x1);
	    val = dom.val();
	    this.props.updateDueDate(this.props.data.id, val);
	},

	render: function () {

		return (
			<div className="row">
				<div className="cell col-md-1">
					<div className={"pull-left icon-gray icon-wrapper  " + this.props.data.activity.classification.scorebook_icon_class} />
				</div>
				<div className="cell col-md-8" >
					<a href={this.props.data.activity.anonymous_path} target="_new">
						{this.props.data.activity.name}
					</a>
				</div>
				<div className="cell col-md-2">
					<input type="text" value={this.props.data.formatted_due_date} ref="dueDate" className="datepicker-input" placeholder="mm/dd/yyyy" />
					<input type="text"  className="railsFormatDate" id={"railsFormatDate" + this.props.data.id} ref="railsFormatDate" />
				</div>
				<div className="cell col-md-1">
					<div className="pull-right icon-x-gray" onClick={this.deleteClassroomActivity}>
					</div>
				</div>
			</div>

		);
	}
});