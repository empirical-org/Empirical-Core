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
      placement: 'top'
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
    $(this.refs.activateTooltip.getDOMNode()).tooltip({
      html: true,
      placement: this.props.placement,
      title: this.tooltipTitle()
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

  displayPercentage: function () {
    if (this.props.data.percentage == null) {
      return "Not completed yet";
    } else {
      return (Math.round(100*this.props.data.percentage)) + "%";
    }
  },

  tooltipClasses: function () {
    return "activate-tooltip icon-wrapper icon-" + this.percentage_color() + " icon-" + this.icon_for_classification();
  },

  tooltipTitle: function () {
    var topicCategoryName;
    if (this.props.data.activity.topic.topic_category) {
      topicCategoryName = this.props.data.activity.topic.topic_category.name;
    }

    var contextSpecific;

    switch(this.props.context) {
      case 'studentProfile':
        contextSpecific = null
        break;
      case 'scorebook':
        contextSpecific = <EC.ConceptResultStats results={this.props.data.concept_results} />
    }

    return React.renderToString(
      <div>
        <h1>{this.props.data.activity.name}</h1>
        <p>{this.props.data.activity.classification.alias}</p>
        <p>{this.props.data.activity.topic.section.name}</p>
        <p>{this.props.data.activity.topic.name}</p>
        <p>{this.props.data.activity.description}</p>
        <p>{topicCategoryName}</p>
        <p>{this.displayPercentage()}</p>
        <p>{this.props.data.due_date_or_completed_at_date}</p>
        {contextSpecific}
      </div>
    );
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
