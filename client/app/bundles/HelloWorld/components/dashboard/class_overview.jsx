'use strict'

 import React from 'react'
 import _ from 'underscore'
 import OverviewMini from './overview_mini'
 import PremiumMini from './premium_mini'
 import TeacherGuide from '../teacher_guide/teacher_guide'
 import BetaMini from './beta_mini.jsx'
 import NewTools from './new_tools_mini.jsx'
 import PremiumPromo from './premium_promo.jsx'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.any
  },

  getInitialState: function() {
    return {displayTeacherGuide: true};
  },

  hideTeacherGuide: function(){
    this.setState({displayTeacherGuide: false});
  },

  showTeacherGuide: function(){
    this.setState({displayTeacherGuide: true});
  },

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <OverviewMini overviewObj={overviewObj} key={overviewObj.header}/>;
    });
    if (this.props.flag === 'beta') {
      minis.unshift(<BetaMini key='beta-mini'/>)
    }
    if (this.state.displayTeacherGuide){
      minis.unshift(<TeacherGuide dashboardMini key='teacher-guide-displayed' hideTeacherGuide={this.hideTeacherGuide} isDisplayed={false}/>);
    }
    return minis;
  },

  hasPremium: function() {
    if ('locked' === this.props.premium) {
      return <PremiumPromo key='promo'/>
    } else if ((this.props.premium === 'none') || (this.props.premium === null)) {
      if (new Date().getMonth() < 5) {
        return <PremiumMini/>;
      }
    }
  },

  announcementMini: function () {
    return <NewTools key='new-tools'/>
  },

  render: function() {
    return (
      <div className='row'>
        {this.announcementMini()}
        {this.overviewMinis()}
        {this.hasPremium()}
      </div>
    );
  }

});
