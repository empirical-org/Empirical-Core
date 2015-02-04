EC.ActivityDueDate = React.createClass({
  componentDidMount: function() {
    // Set up the datepicker on the dueDate input
    $(this.refs.dueDate.getDOMNode()).datepicker({
      selectOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      minDate: -20,
      maxDate: "+1M +10D"       
    });
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
          <input type="text" ref="dueDate" className="datepicker-input" placeholder="mm/dd/yyyy" />
        </td>
        <td className="icon-x-gray" onClick={this.props.removeActivity}></td>
      </tr>
    );
  }
});