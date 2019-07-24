'use strict'

 import React from 'react'
 import { Link } from 'react-router'
 import UnitTemplateFirstRow from './unit_template_first_row'
 import UnitTemplateSecondRow from './unit_template_second_row'
 import String from '../../../../modules/string.jsx'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
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
        <img src={this.avatarUrl()}/>
      </div>
    );
  },

  // getClassName: function () {
  //   var val;
  //   if (this.props.index === 1) {
  //     val = 'row unit-template-mini pull-right'
  //   } else {
  //     val = 'row unit-template-mini'
  //   }
  //   return val;
  // },

  getLink: function () {
    let link
    if (this.props.data.id == 'createYourOwn') {
      if (this.props.signedInTeacher || (this.props.non_authenticated === false)) {
        link = '/teachers/classrooms/assign_activities/create-unit'
      } else {
        link = '/account/new'
      }
    } else {
      if (this.props.signedInTeacher || (this.props.non_authenticated === false)) {
        link = `/teachers/classrooms/assign_activities/featured-activity-packs/${this.props.data.id}`;
      } else {
        link = `/activities/packs/${this.props.data.id}`
      }
    }
    return link
  },

  miniSpecificComponents: function() {
    if (this.props.data.id == 'createYourOwn') {
      return (
        <Link to={this.getLink()}>
          <div className='text-center create-your-own'>
            <div className='content-wrapper'>
              <img className='plus_icon' src='/add_class.png'/>
              <h3>Create Your Own Activity Pack</h3>
              <h5 style={{paddingTop: '5px'}}>Select from over 150 grammar exercises.</h5>
            </div>
          </div>
        </Link>
      );
    }
    // else it is a normal mini
    else {
      return(
          <Link to={this.getLink()}>
            <div>
              <UnitTemplateFirstRow
                  data={this.props.data}
                  modules={{string: this.modules.string}} />
              <UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
              {this.displayPicture()}
            </div>
          </Link>
        );
      }
  },

  render: function () {
    return (
      <div className='unit-template-mini' onClick={this.onClickAction}>
        {this.miniSpecificComponents()}
      </div>
    );
  }
});
