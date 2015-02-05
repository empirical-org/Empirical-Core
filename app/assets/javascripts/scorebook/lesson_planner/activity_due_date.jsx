EC.ActivityDueDate = React.createClass({
  componentDidMount: function() {
    // Set up the datepicker on the dueDate input

    // FIXME: Datepicker not working (conflict with bootstrap? see noConflict())
    // $(this.refs.dueDate.getDOMNode()).datepicker({
    //   selectOtherMonths: true,
    //   dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    //   minDate: -20,
    //   maxDate: "+1M +10D"       
    // });
    

    // FIXME: Datepicker not working (conflict with bootstrap? see noConflict())
    $('.datepicker-input').datepicker({
      selectOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      minDate: -20,
      maxDate: "+1M +10D"       
    });
    
  },

  handleChange: function(e) {
    var val = $(e.target).val(); // due date
    this.props.assignActivityDueDate(this.props.activity, val);
  },

  removeActivity: function () {
    this.props.toggleActivitySelection(false, this.props.activity);
  },  

  render: function() {
    return (
      <tr>
        <td className={this.props.activity.image_class}></td>
        <td>{this.props.activity.name}</td>
        <td>
          <input type="text" ref="dueDate" className="datepicker-input" placeholder="mm/dd/yyyy" onChange={this.handleChange} />
        </td>
        <td className="icon-x-gray" onClick={this.props.removeActivity}></td>
      </tr>
    );
  }
});