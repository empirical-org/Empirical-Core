"use strict";
EC.ActivityIconWithTooltip = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    context: React.PropTypes.string.isRequired, // studentProfile, scorebook
    placement: React.PropTypes.string // not required
  },

  getDefaultProps: function () {
    return {
      context: 'scorebook',
      placement: 'bottom'
    }
  },

  percentage_color: function (percentage) {
    var y;
    var x = this.props.data.percentage;

    if (x == null) {
      y = 'gray'
    } else if (x < 0.5) {
      y = 'red';
    } else if (x <= 0.75) {
      y = 'orange';
    } else if (x <= 1.0) {
      y = 'green';
    } else {
      y = 'gray';
    }
    return y;
  },

  componentDidMount: function () {
    this.modules = {
      titleGenerator: new EC.modules.TooltipTitleGeneratorGenerator(this.props.context).generate(this.props.data)
    }
    $(this.refs.activateTooltip.getDOMNode()).tooltip({
      html: true,
      placement: this.props.placement,
      title: this.modules.titleGenerator.generate(this.props.data)
    });
  },

  icon_for_classification: function () {
      var y;
      var x = this.props.data.activity.classification.id;
      if (x == 1) {
        y = 'flag';
      } else {
        y = 'puzzle';
      }
      return y;
  },

  tooltipClasses: function () {
    return "activate-tooltip icon-wrapper icon-" + this.percentage_color() + " icon-" + this.icon_for_classification();
  },

  render: function () {
    return (
      <div
        ref='activateTooltip'
        className={this.tooltipClasses()}>
      </div>
    );
  }
});
