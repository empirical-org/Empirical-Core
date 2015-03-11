EC.ActivityIconWithTooltip = React.createClass({

  percentage_color: function (percentage) {
    var y;
    x = this.props.data.percentage
    

    if (x < 0.5) {
      y = 'red'
    } else if (x < 0.75) {
      y = 'orange'
    } else if (x <= 1.0) {
      y = 'green'
    } else {
      y = 'gray'
    }
    return y
  },

  icon_for_classification: function (classification) {
    return 'puzzle'
  },

  render: function () {
    return (
      <div 
        className={"activate-tooltip icon-wrapper icon-" + this.percentage_color() + " icon-" + this.icon_for_classification() }
        data-toggle='tooltip'
        data-html={true}
        data-placement='left'
        title={(this.props.data.percentage)}
      >
      </div>

    );
  }


});









