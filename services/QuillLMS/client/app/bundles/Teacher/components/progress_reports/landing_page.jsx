import React from 'react';

import GenericMini from '../shared/generic_mini.jsx';

export default class extends React.Component {
  miniList = () => {
    return [
      // {
      //   title: 'Real-time',
      //   href: '/teachers/progress_reports/real_time',
      //   img: `${process.env.CDN_URL}/images/illustrations/real-time-landing.svg`,
      //   bodyText: 'See which students are online and which students are taking a long time to complete their question. ',
      //   pStyle: { padding: '0px 2px', },
      //   flag: null,
      // },
      {
        title: 'Activity Summary',
        href: '/teachers/classrooms/scorebook',
        img: `${process.env.CDN_URL}/images/shared/visual_overview.svg`,
        bodyText: 'Quickly see which activities your students have completed with color coded icons that show level of proficiency.',
        pStyle: { padding: '0px 2px', },
        flag: null,
      }, {
        title: 'Activity Analysis',
        href: '/teachers/progress_reports/diagnostic_reports#/activity_packs',
        img: `${process.env.CDN_URL}/images/shared/activity_analysis.svg`,
        bodyText: 'See how students responded to each question and get a clear analysis of the skills they demonstrated.',
        flag: null,
      }, {
        title: 'Diagnostics',
        href: '/teachers/progress_reports/diagnostic_reports/#/diagnostics',
        img: `${process.env.CDN_URL}/images/shared/diagnostic.svg`,
        bodyText: 'View the results of the diagnostics, and get a personalized learning plan with recommended activities.',
        flag: null,
      }, {
        title: 'Activity Scores',
        premium: true,
        href: '/teachers/progress_reports/activities_scores_by_classroom',
        img: `${process.env.CDN_URL}/images/illustrations/activity-scores-illustration.svg`,
        bodyText: 'View and download the overall score and the individual scores on each activity in an activity pack as a CSV.',
        flag: null,
        pStyle: { padding: '0px 7px', },
      }, {
        title: 'Concepts',
        premium: true,
        href: '/teachers/progress_reports/concepts/students',
        img: `${process.env.CDN_URL}/images/shared/concepts.svg`,
        bodyText: 'View an overall summary of how each of your students is performing on all of the  writing and grammar concepts.',
        flag: null,
      }, {
        title: 'Standards',
        premium: true,
        href: '/teachers/progress_reports/standards/classrooms',
        img: `${process.env.CDN_URL}/images/shared/common_core.svg`,
        bodyText: 'Following the Common Core? Check this view to see how your students are performing on specific standards.',
        flag: null,
      }, {
        title: 'Data Export',
        premium: true,
        href: '/teachers/progress_reports/activity_sessions',
        img: `${process.env.CDN_URL}/images/shared/list_overview.svg`,
        bodyText: 'You can export the data as a CSV file by filtering for the classrooms, activity packs, or students you would like to export and then pressing "Download Report."',
        flag: null,
        pStyle: { marginTop: '-17px', },
      }
    ];
  };

  miniBuilder = (mini) => {
    const premium = mini.premium ? <h4 className="premium">Premium<i aria-hidden="true" className="fas fa-star" /></h4> : null;
    return (
      <GenericMini key={mini.title}>
        <a href={mini.href}>
          <h3>{mini.title}</h3>
          {premium}
          <div className="img-wrapper">
            <img src={mini.img} />
          </div>
          <p style={mini.pStyle ? mini.pStyle : {}}>{mini.bodyText}</p>
        </a>
      </GenericMini>
    );
  };

  minis = () => {
    const minisArr = [];
    this.miniList().forEach((mini) => {
			// if the flag isn't mini or beta we always want to display it
      if (['beta', 'alpha'].indexOf(mini.flag) === -1) {
        minisArr.push(this.miniBuilder(mini));
			// if the flag is beta only show to beta/alpha users
      } else if (mini.flag === 'beta' && this.props.flag === ('beta' || 'alpha')) {
        minisArr.push(this.miniBuilder(mini));
			// if the flag is alpha, only show to alpha users
      } else if (mini.flag === 'alpha' && this.props.flag === 'alpha') {
        minisArr.push(this.miniBuilder(mini));
      }
    });
    return minisArr;
  };

  render() {
    return (
      <div className="progress-reports-landing-page">
        <div className="generic-mini-container">
          <h1>Choose which type of report you’d like to see:</h1>
          <div className="generic-minis">{this.minis()}</div>
        </div>
      </div>
    );
  }
}
