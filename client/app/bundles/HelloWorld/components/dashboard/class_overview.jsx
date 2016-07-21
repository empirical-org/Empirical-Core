'use strict'

 import React from 'react'
 import _ from 'underscore'
 import OverviewMini from './overview_mini'
 import PremiumMini from './premium_mini'
 import TeacherGuide from '../teacher_guide/teacher_guide'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
  },

  getInitialState: function() {
    return {displayTeacherGuide: true};
  },

  hideTeacherGuide: function(){
    this.setState({displayTeacherGuide: false});
  },

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <OverviewMini overviewObj={overviewObj} key={overviewObj.header}/>;
    });
    if (this.state.displayTeacherGuide){
      minis.unshift(<TeacherGuide dashboardMini={true} key='teacher-guide-displayed' hideTeacherGuide={this.hideTeacherGuide}/>);
    }
    return minis;
  },

  hasPremium: function() {
    if (this.props.data !== null && (this.props.premium === 'none') || (this.props.premium === null)) {
      return <PremiumMini/>;
    }
  },


  render: function() {
    return (
      <div className='row'>
        {this.overviewMinis()}
        {this.hasPremium()}
      </div>
    );
  }

});
