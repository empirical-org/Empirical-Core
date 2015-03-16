EC.ActivityIconWithTooltip = React.createClass({

  percentage_color: function (percentage) {
    var y;
    var x = this.props.data.percentage
    

    if (x < 0.5) {
      y = 'red'
    } else if (x <= 0.75) {
      y = 'orange'
    } else if (x <= 1.0) {
      y = 'green'
    } else {
      y = 'gray'
    }
    return y
  },
  componentDidMount: function () {
    $(this.refs.activateTooltip.getDOMNode()).tooltip()
  },  
  icon_for_classification: function () {
      var y; 
      var x = this.props.data.activity.classification.id
      if (x == 1) {
        y = 'flag'
      } else {
        y = 'puzzle'
      }
      return y
  },
  displayPercentage: function () {
    if (this.props.data.percentage == null) {
      return ""
    } else {
      return "<p>" + (100*this.props.data.percentage) + "%" + "</p>"
    }
  },
  tooltipTitle: function () {
    return (
          "<h1>" + this.props.data.activity.name +  "</h1>"
        + "<p>" + this.props.data.activity.classification.alias + "</p>"
        + "<p>" + this.props.data.activity.topic.section.name + "</p>"
        + "<p>" + this.props.data.activity.topic.name + "</p>"
        + "<p>" + this.props.data.activity.description + "</p>"
        + "<p>" + this.props.data.activity.topic.topic_category.name + "</p>"
        + this.displayPercentage()
        + "<p>" + "...all concept class stats..." + "</p>"
      )

  },

  render: function () {
    return (
      <div 
        ref='activateTooltip'
        className={"activate-tooltip icon-wrapper icon-" + this.percentage_color() + " icon-" + this.icon_for_classification() }
        data-toggle='tooltip'
        data-html={true}
        data-placement='top'
        title= {this.tooltipTitle()}
      >
      </div>

    );
  }


});









