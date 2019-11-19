'use strict'

 import React from 'react'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  authorName: function () {
    var name;
    if (this.props.data.author) {
      name = this.props.data.author.name;
    } else {
      name = null;
    }
    return name;
  },

  sayAttribution: function () {
    return ['by', this.authorName()].join(' ');
  },

  numberOfActivities: function () {
    return this.props.data.activities ? this.props.data.activities.length : 0;
  },

  sayActivitiesCount: function () {
    return this.props.modules.string.sayNumberOfThings(this.numberOfActivities(), 'Activity', 'Activities')
  },


  sayTime: function () {
    return [this.props.data.time, 'mins'].join(' ');
  },

  render: function () {
    return (
      <div className='white-row'>
        <div className='row info-row'>
          <div style={{flex: 3}}>
            <div className='author'>
              {this.sayAttribution()}
            </div>
          </div>
          <div style={{flex: 5}}>
            <div className='activities-count'>
              <i className='fas fa-th-list' />
              {this.sayActivitiesCount()}
            </div>
            <div className='time'>
              <i className='far fa-clock' />
              <div className='time-number'>
                {this.sayTime()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
