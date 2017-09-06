import React from 'react';
import _ from 'underscore';
import OverviewMini from './overview_mini';
import PremiumMini from './premium_mini';
import TeacherGuide from '../teacher_guide/teacher_guide';
import BetaMini from './beta_mini.jsx';
import NewTools from './new_tools_mini.jsx';
import QuillLessonsAnnouncement from './quill_lessons_announcement_mini.jsx';
import PremiumPromo from './premium_promo.jsx';
import LessonsList from './lessons_list.jsx';

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
    const minis = _.map(this.props.data, overviewObj => <OverviewMini overviewObj={overviewObj} key={overviewObj.header} />);
    return minis;
  },

  betaMini() {
    if (this.props.flag === 'beta') {
      return <BetaMini key="beta-mini" />;
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
      if (new Date().getMonth() < 5) {
        return <PremiumMini />;
      }
    }
  },

  announcementMini() {
    const announcements = [];
    if (this.props.flag === 'beta') {
      announcements.push(<QuillLessonsAnnouncement key="lessons-announcement" />);
    }
    return announcements;
  },

  lessonsList() {
    if (this.props.flag === 'beta') {
      return <LessonsList />;
    }
  },

  render() {
    return (
      <div className="row">
        {this.teacherGuide()}
        {this.announcementMini()}
        {this.overviewMinis()}
        {this.hasPremium()}
        {this.lessonsList()}
        {this.betaMini()}
      </div>
    );
  },

});
