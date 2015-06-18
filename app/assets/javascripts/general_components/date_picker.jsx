"use strict";
EC.DatePicker = React.createClass({

  getInitialState: function () {
    return {
      isDateSelected: false
    };
  },

  componentDidMount: function () {
    $(this.refs.date.getDOMNode()).datepicker({
      selectOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      dateFormat: 'mm-dd-yy',
      altField: ('#railsFormatDate' + this.props.key),
      altFormat: 'yy-mm-dd',
      onSelect: this.handleChange
    });
  },

  handleChange: function () {
    this.setState({isDateSelected: true}, function () {
      var x1 = '#railsFormatDate' + this.props.key;
      var dom = $(x1);
      var val = dom.val();
      this.props.handleChange(val);
    });
  },

  deselect: function () {
    this.setState({isDateSelected: false}, function () {
      $(this.refs.date.getDOMNode()).datepicker('setDate')
      this.props.handleChange(null)
    })
  },

  render: function () {
    var unselect, additionalClassName;
    if (this.state.isDateSelected) {
      unselect = <span className='icon-x-gray' onClick={this.deselect}></span>
      additionalClassName = "date-is-selected";
    } else {
      unselect = null;
      additionalClassName = "";
    }

    return (
      <span className="datepicker-container">
        <span className="datepicker-and-x">
          <input
            type="text"
            ref="date"
            className={"datepicker-input " + additionalClassName}
            placeholder={this.props.placeHolder}
            onChange={this.handleChange} />
          {unselect}
        </span>
        <input
          type="text"
          ref="railsFormatDate"
          id={"railsFormatDate" + this.props.key}
          className="railsFormatDate"
          onChange={this.handleChange} />
      </span>
    );
  }
});