import React from 'react';

import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from './progress_report_constants'

import DemoOnboardingTour, { STUDENT_REPORTS_LANDING_PAGE, } from '../shared/demo_onboarding_tour'
import { DropdownInput, } from '../../../Shared/index'

const ALL = 'ALL'
const ALL_OPTION = { label: 'All classrooms', value: ALL }

const miniList = () => {
  return [
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
      id: 'diagnostic-reports-card',
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
}

const miniBuilder = (mini) => {
  const premium = mini.premium ? <h4 className="premium">Premium<i aria-hidden="true" className="fas fa-star" /></h4> : null;
  return (
    <div className="generic-mini" id={mini.id} key={mini.title}>
      <a href={mini.href}>
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


const LandingPage = ({ classrooms, flag, }) => {
  const selectedClassroom = classrooms && classrooms.find(c => Number(c.id) === Number(window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)))
  const [selectedClassroomId, setSelectedClassroomId] = React.useState(selectedClassroom && selectedClassroom.id || ALL)

  function onClassesDropdownChange(e) {
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, e.value)
    setSelectedClassroomId(e.value)
  }

  const dropdownOptions = [ALL_OPTION].concat(classrooms ? classrooms.map(c => ({ value: c.id, label: c.name, })) : [])

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

  return (
    <div className="progress-reports-landing-page">
      <DemoOnboardingTour pageKey={STUDENT_REPORTS_LANDING_PAGE} />
      <div className="generic-mini-container">
        <div className="header">
          <h1>Choose which type of report you’d like to see:</h1>
          <DropdownInput
            handleChange={onClassesDropdownChange}
            isSearchable={false}
            options={dropdownOptions}
            value={dropdownOptions.find(opt => opt.value === selectedClassroomId)}
          />
        </div>
        <div className="generic-minis">{minis()}</div>
      </div>
    </div>
  );
}

export default LandingPage
