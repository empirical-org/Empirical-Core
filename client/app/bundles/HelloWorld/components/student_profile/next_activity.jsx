'use strict';
import React from 'react'
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object // may be absent if there is no next_activity (student has completed all assigned activities)
  },
  //<div className="activate-tooltip icon-wrapper icon-gray icon-puzzle"></div>
  render: function () {
    var result;
    if (this.props.data) {
      result = (
        <div className="container">
          <section>
            <div className="row">
              <div className="col-xs-12 col-sm-7 col-xl-7">
                <ActivityIconWithTooltip data={this.props.data} context={'studentProfile'} placement={'bottom'}/>
                <div className="icons-description-wrapper">
                  <p className="title title-v-centered">{this.props.data.activity.name}</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-5 col-xl-5 start-activity-wrapper">
                <a href={this.props.data.link}>
                  <button className='button-green pull-right'>Start Your Next Lesson</button>
                </a>
              </div>
            </div>
          </section>
        </div>
      )
    } else {
      result = <span></span>
    }
    return result;

  }
})
