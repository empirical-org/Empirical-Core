'use strict'

 import React from 'react'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    modules: React.PropTypes.shape({
      string: React.PropTypes.object.isRequired
    })
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
    return this.props.data.activities.length;
  },

  sayActivitiesCount: function () {
    return this.props.modules.string.sayNumberOfThings(this.numberOfActivities(), 'Activity', 'Activities')
  },


  sayTime: function () {
    return [this.props.data.time, 'mins'].join(' ');
  },

  render: function () {
    return (
      <div className='row white-row'>
        <div className='col-xs-12'>
          <div className='row info-row'>
            <div className='col-xs-6'>
              <div className='author'>
                {this.sayAttribution()}
              </div>
            </div>
            <div className='col-xs-6'>
              <div className='activities-count'>
                <i className='fa fa-th-list'></i>
                {this.sayActivitiesCount()}
              </div>
              <div className='time'>
                <i className='fa fa-clock-o'></i>
                <div className='time-number'>
                  {this.sayTime()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
