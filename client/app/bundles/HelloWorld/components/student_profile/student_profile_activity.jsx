import React from 'react';
import moment from 'moment';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

    } else if (this.props.data.locked) {
      return (<p className="title-v-centered text-right" style={{ color: '#969696', }}>Locked by teacher</p>);
    } else if (this.props.data.activity.activity_classification_id === 6) {
      linkText = 'Join Lesson'
    } else {
      linkText = 'Start Activity';
    }
    return <a href={this.props.data.link}>{linkText}</a>;
  },

  renderDueDate() {
    return this.props.data.due_date ? <span className="due-date">{moment(this.props.data.due_date).format('MM-DD-YYYY')}</span> : <span />;
  },

  dataForActivityIconWithToolTip() {
    return {
      percentage: this.props.data.max_percentage,
      activity_classification_id: this.props.data.activity_classification_id,
    };
  },

  render() {
    return (
      <div className="line">
        <div className="row">
          <div className="col-xs-8 col-sm-9 col-xl-9 pull-left">
            <ActivityIconWithTooltip data={this.dataForActivityIconWithToolTip()} context={'studentProfile'} />
            <div className="icons-description-wrapper">
              <p className="title title-v-centered">{this.props.data.name}</p>
            </div>
          </div>
          <span className="row-list-end">
            {this.renderDueDate()}
            {this.renderStartButtonOrLockMessage()}
          </span>
        </div>
      </div>
    );
  },
});
