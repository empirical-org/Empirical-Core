import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  renderStartButton() {
    let linkText;
    if (!this.props.data.repeatable && this.props.finished) {
      return (<p className="title-v-centered text-right">Completed</p>);
    } else if (this.props.finished) {
      linkText = 'Replay Activity';
    } else if (this.props.data.state == 'started') {
      linkText = 'Resume Activity';
    } else {
      linkText = 'Start Activity';
    }
    return <a href={this.props.data.link}>{linkText}</a>;
  },

  renderDueDate() {
    return this.props.data.due_date ? <span className="due-date">{this.props.data.due_date}</span> : <span />;
  },

  render() {
    console.log('data', this.props.data);
    return (
      <div className="line">
        <div className="row">
          <div className="col-xs-8 col-sm-9 col-xl-9 pull-left">
            <ActivityIconWithTooltip data={this.props.data} context={'studentProfile'} />
            <div className="icons-description-wrapper">
              <p className="title title-v-centered">{this.props.data.name}</p>
            </div>
          </div>
          <span className="row-list-end">
            {this.renderDueDate()}
            {this.renderStartButton()}
          </span>
        </div>
      </div>
    );
  },
});
