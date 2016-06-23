'use strict'

 import React from 'react'
 import UnitTemplateFirstRow from './unit_template_first_row'
 import UnitTemplateSecondRow from './unit_template_second_row'
 import String from '../../../../modules/string.jsx'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.modules = {
      string: new String()
    }
    return {};
  },

  number_of_activities: function () {
    return this.props.data.activities.length;
  },

  say_time: function () {
    return [this.props.data.time, 'mins'].join(' ');
  },

  say_number_of_activities: function () {
    return this.modules.string.sayNumberOfThings(this.number_of_activities(), 'Activity', 'Activities')
  },

  avatarUrl: function () {
    var url;
    if (this.props.data.author) {
      url = this.props.data.author.avatar_url
    } else {
      url = null;
    }
    return url;
  },

  displayPicture: function () {
    return (
      <div className='author-picture'>
        <img src={this.avatarUrl()}></img>
      </div>
    );
  },

  getClassName: function () {
    var val;
    if (this.props.index === 1) {
      val = 'row unit-template-mini pull-right'
    } else {
      val = 'row unit-template-mini'
    }
    return val;
  },

  onClickAction: function () {
    if (this.props.data.id == 'createYourOwn') {
      this.props.actions.toggleTab('createUnit');
    } else {
      this.props.actions.selectModel(this.props.data);
    }
  },

  miniSpecificComponents: function() {
    if (this.props.data.id == 'createYourOwn') {
      return (
        <div className='text-center col-xs-12 create-your-own'>
          <div className='content-wrapper'>
            <img className='plus_icon' src='/add_class.png'></img>
            <h3>Build Your Own Activity Pack</h3>
          </div>
      </div>
    );
      }
    // else it is a normal mini
    else {
      return(
          <div className='col-xs-12'>
              <UnitTemplateFirstRow
                  actions={{filterByCategory: this.props.actions.filterByCategory}}
                  data={this.props.data}
                  modules={{string: this.modules.string}} />
              <UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
              {this.displayPicture()}
            </div>
          );
        }
  },

  render: function () {
    return (
      <div className={this.getClassName()} onClick={this.onClickAction}>
        {this.miniSpecificComponents()}
      </div>
    );
  }
});
