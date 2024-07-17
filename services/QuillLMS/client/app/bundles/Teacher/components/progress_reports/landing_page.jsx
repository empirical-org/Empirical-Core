import React from 'react';

import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants';

import DemoOnboardingTour, { DEMO_ONBOARDING_STUDENT_REPORTS_LANDING_PAGE, } from '../shared/demo_onboarding_tour';

const miniList = () => {
  return [
    {
      title: 'Activity Summary Report',
      href: '/teachers/classrooms/scorebook',
      img: `${process.env.CDN_URL}/images/shared/visual_overview.svg`,
      bodyText: 'Quickly see which activities your students have completed and the skills that were demonstrated.',
      flag: null,
    }, {
      title: 'Activity Analysis Report',
      href: '/teachers/progress_reports/diagnostic_reports#/activity_packs',
      img: `${process.env.CDN_URL}/images/shared/activity_analysis.svg`,
      bodyText: 'See how students responded to each question and get a clear analysis of the skills they demonstrated.',
      flag: null,
    }, {
      title: 'Diagnostics Report',
      href: '/teachers/progress_reports/diagnostic_reports/#/diagnostics',
      id: 'diagnostic-reports-card',
      img: `${process.env.CDN_URL}/images/shared/diagnostic.svg`,
      bodyText: 'View diagnostic results and get a personalized learning plan with recommended activities.',
      flag: null,
    }, {
      title: 'Activity Scores Report',
      premium: true,
      href: '/teachers/progress_reports/activities_scores_by_classroom',
      img: `${process.env.CDN_URL}/images/illustrations/activity-scores-illustration.svg`,
      bodyText: 'View and download each student’s overall score and their individual scores per activity as a PDF or CSV.',
      flag: null,
    }, {
      title: 'Concepts Report',
      premium: true,
      href: '/teachers/progress_reports/concepts/students',
      img: `${process.env.CDN_URL}/images/shared/concepts.svg`,
      bodyText: 'View an overall summary of how your students are performing across all writing and grammar concepts.',
      flag: null,
    }, {
      title: 'Standards Report',
      premium: true,
      href: '/teachers/progress_reports/standards/classrooms',
      img: `${process.env.CDN_URL}/images/shared/common_core.svg`,
      bodyText: 'View this report to see how your students are performing on specific National standards.',
      flag: null,
    }, {
      title: 'Data Export',
      premium: true,
      href: '/teachers/progress_reports/activity_sessions',
      img: `${process.env.CDN_URL}/images/shared/list_overview.svg`,
      bodyText: 'You can export the data as a CSV file by filtering for the classrooms, activity packs, or students you would like to export and then pressing “Download Report.”',
      flag: null,
      pStyle: { marginTop: '-17px', },
    }
  ];
}

const contentHubMiniList = (hasAssignedSocialStudiesActivities, hasAssignedScienceActivities) => {
  const socialStudiesLink = hasAssignedSocialStudiesActivities ? ' ': '/assign/social-studies'
  const socialStudiesBodyText = hasAssignedSocialStudiesActivities ? 'Your one-stop shop for assigning new social studies activities and tracking student progress.' : "Explore Quill's Social Studies Activities. Once assigned, return here to assign additional activities and track student progress."

  const interdisciplinaryScienceLink = hasAssignedScienceActivities ? ' ': '/assign/interdisciplinary-science'
  const interdisciplinaryScienceBodyText = hasAssignedScienceActivities ? 'Your one-stop shop for assigning new interdisciplinary science activities and tracking student progress.' : "Explore Quill's Interdisciplinary Science Activities. Once assigned, return here to assign additional activities and track student progress."

  return [
    {
      title: 'Social Studies Dashboard',
      href: socialStudiesLink,
      img: `${process.env.CDN_URL}/images/illustrations/world-history-dashboard.svg`,
      bodyText: socialStudiesBodyText,
      flag: null,
      new: true
    }, {
      title: 'Interdisciplinary Science Dashboard',
      href: interdisciplinaryScienceLink,
      img: `${process.env.CDN_URL}/images/illustrations/ai-dashboard.svg`,
      bodyText: interdisciplinaryScienceBodyText,
      flag: null,
      new: true
    }
  ]
}

const miniBuilder = (mini) => {
  const newElement = mini.new ? <span className="new-tag">NEW</span> : null
  const premium = mini.premium ? <h4 className="premium"><span>Premium</span><img alt="" src={`${process.env.CDN_URL}/images/icons/yellow-diamond.svg`} /></h4> : null;
  return (
    <div className="generic-mini" id={mini.id} key={mini.title}>
      <a href={mini.href}>
        {newElement}
        <h3>{mini.title}</h3>
        {premium}
        <div className="img-wrapper">
          <img alt="" src={mini.img} />
        </div>
        <p style={mini.pStyle ? mini.pStyle : {}}>{mini.bodyText}</p>
      </a>
    </div>
  );
};


const LandingPage = ({ flag, }) => {
  const minis = () => {
    const minisArr = [];
    miniList().forEach((mini) => {
      // if the flag isn't mini or beta we always want to display it
      if (['beta', 'alpha'].indexOf(mini.flag) === -1) {
        minisArr.push(miniBuilder(mini));
        // if the flag is beta only show to beta/alpha users
      } else if (mini.flag === 'beta' && flag === ('beta' || 'alpha')) {
        minisArr.push(miniBuilder(mini));
        // if the flag is alpha, only show to alpha users
      } else if (mini.flag === 'alpha' && flag === 'alpha') {
        minisArr.push(miniBuilder(mini));
      }
    });
    return minisArr;
  };

  const contentHubMinis = contentHubMiniList(false, false).map(mini => miniBuilder(mini))

  return (
    <div className="progress-reports-landing-page">
      <DemoOnboardingTour pageKey={DEMO_ONBOARDING_STUDENT_REPORTS_LANDING_PAGE} />
      <div className="generic-mini-container">
        <div className="header">
          <h1>Choose which type of report you’d like to see:</h1>
        </div>
        <div className="generic-minis">{minis()}</div>
        <div className="header">
          <h1>Access curriculum-specific dashboards:</h1>
        </div>
        <div className="curriculum-minis">{contentHubMinis}</div>
      </div>
    </div>
  );
}

export default LandingPage
