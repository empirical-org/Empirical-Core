'use strict';
import React from 'react'
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx'
import LoadingIndicator from '../shared/loading_indicator'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object // may be absent if there is no next_activity (student has completed all assigned activities)
  },
  //<div className="activate-tooltip icon-wrapper icon-gray icon-puzzle"></div>
  render: function () {
    var result;
    if (this.props.data) {
      result = (
          <div className="next-activity">
            <div className="next-activity-name">
                <ActivityIconWithTooltip data={this.props.data} context={'studentProfile'} placement={'bottom'}/>
                <p>{this.props.data.activity.name}</p>
            </div>
            <div className="start-activity-wrapper">
              <a href={this.props.data.link}>
                <button className='button-green pull-right'>Start Activity</button>
              </a>
            </div>
          </div>
      )
    } else if (this.props.loading) {
      result = <LoadingIndicator/>
    } else if (this.props.hasActivities){
      result = <span/>
    } else {
      result = <div className="container">
        <p style={{fontSize: '18px', margin: '2em'}}>Your teacher hasn't assigned any activities to you yet.</p>
      </div>

    }
    return result;

  }
})
