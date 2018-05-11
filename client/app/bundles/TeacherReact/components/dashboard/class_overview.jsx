import React from 'react';
import _ from 'underscore';
import OverviewMini from './overview_mini';
import PremiumMini from './premium_mini';
import TeacherGuide from '../teacher_guide/teacher_guide';
import BetaMini from './beta_mini.jsx';
import NewTools from './new_tools_mini.jsx';
import CoteachingAnnouncement from './coteaching_announcement_mini.jsx';
import PremiumPromo from './premium_promo.jsx';
import LessonsList from './lessons_list.jsx';
import DiagnosticMini from './diagnostic_mini.jsx'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.any,
  },

  getInitialState() {
    return { displayTeacherGuide: true, };
  },

  hideTeacherGuide() {
    this.setState({ displayTeacherGuide: false, });
  },

  showTeacherGuide() {
    this.setState({ displayTeacherGuide: true, });
  },

  overviewMinis() {
    const minis = _.map(this.props.data, overviewObj => {
      if (overviewObj.results && overviewObj.results !== 'insufficient data') {
        return <OverviewMini overviewObj={overviewObj} key={overviewObj.header} />
      }
    });
    return _.compact(minis)
  },

  betaMini() {
    if (this.props.flag === 'beta') {
      // return <BetaMini key="beta-mini" />;
    }
  },

  teacherGuide() {
    if (this.state.displayTeacherGuide) {
      return <TeacherGuide dashboardMini key="teacher-guide-displayed" hideTeacherGuide={this.hideTeacherGuide} isDisplayed={false} />;
    }
  },

  hasPremium() {
    if (this.props.premium === 'locked') {
      return <PremiumPromo key="promo" />;
    } else if ((this.props.premium === 'none') || (this.props.premium === null)) {
      return <PremiumMini />;
    }
  },

  announcementMini() {
    const announcements = [];
    announcements.push(<CoteachingAnnouncement key="coteaching-announcement" />);
    return announcements;
  },

  lessonsList() {
    return <LessonsList />;
  },

  diagnosticMini() {
    return <DiagnosticMini />
  },

  render() {
    return (
      <div className="row">
        {this.teacherGuide()}
        {this.diagnosticMini()}
        {this.lessonsList()}
        {this.hasPremium()}
        {this.announcementMini()}
        {this.overviewMinis()}
        {this.betaMini()}
      </div>
    );
  },

});
