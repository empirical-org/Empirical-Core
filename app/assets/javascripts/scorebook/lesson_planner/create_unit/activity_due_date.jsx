EC.ActivityDueDate = React.createClass({
  componentDidMount: function() {
    // Set up the datepicker on the dueDate input

    $(this.refs.dueDate.getDOMNode()).datepicker({
      selectOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      minDate: -20,
      maxDate: "+1M +10D",
      dateFormat: "mm-dd-yy",
      altField: ('#railsFormatDate' + this.props.activity.id),
      altFormat: 'yy-mm-dd',
      onSelect: this.handleChange
    });

  },

  tooltipTrigger: function (e) {
    e.stopPropagation();
    $(this.refs.activateTooltip.getDOMNode()).tooltip('show');

  },
  tooltipTriggerStop: function (e) {
    e.stopPropagation();
    $(this.refs.activateTooltip.getDOMNode()).tooltip('hide');
  },

  handleChange: function(e) {
    var x1 = '#railsFormatDate' + this.props.activity.id;
    var dom = $(x1);
    var val = dom.val();
    this.props.assignActivityDueDate(this.props.activity, val);
  },

  removeActivity: function () {
    this.props.toggleActivitySelection(false, this.props.activity);
  },

  render: function() {
    return (
      <tr>
        <td>
          <div ref='activateTooltip' className={'activate-tooltip ' + this.props.activity.classification.image_class } data-html='true' data-toggle='tooltip' data-placement='top' title={"<h1>" + this.props.activity.name + "</h1><p>App: " + this.props.activity.classification.alias + "</p><p>" + this.props.activity.topic.name +  "</p><p>" + this.props.activity.description + "</p>"}></div>
        </td>
        <td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className='tooltip-trigger activity_name'>{this.props.activity.name}</td>
        <td>
          <input type="text" ref="dueDate" className="datepicker-input" placeholder="mm/dd/yyyy" onChange={this.handleChange}/>
          <input type="text" className='railsFormatDate' id={"railsFormatDate" + this.props.activity.id} ref="railsFormatDate" onChange={this.handleChange} />
        </td>
        <td className="icon-x-gray" onClick={this.removeActivity}></td>
      </tr>
    );
  }
});