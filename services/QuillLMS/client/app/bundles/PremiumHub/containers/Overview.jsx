import Pusher from 'pusher-js';
import React from 'react';
import { Link, } from 'react-router-dom';

import DistrictStandardsReports from './DistrictStandardsReports';

import { requestGet, requestPost, } from '../../../modules/request/index';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor';
import { Snackbar, defaultSnackbarTimeout, Tooltip, } from '../../Shared/index';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import SnapshotCount from '../components/usage_snapshots/snapshotCount'
import { sentencesWrittenSnapshotInfo, studentLearningHoursSnapshotInfo, } from '../components/usage_snapshots/shared'
import { RESTRICTED, } from '../shared'

const USAGE_HIGHLIGHTS = 'Usage Highlights'
const PROFESSIONAL_DEVELOPMENT_AND_SUPPORT = 'Professional Development and Support'
const ACCOUNT_MANAGEMENT = 'Account Management'
const PREMIUM_REPORTS = 'Premium Reports'
const INTEGRATIONS = 'Integrations'

const iconLinkBase = `${process.env.CDN_URL}/images/pages/administrator/overview`

const scarletAndNattalieImg = <img alt="" src={`${iconLinkBase}/scarlet-and-nattalie.png`} />
const alexAndCharlieImg = <img alt="" src={`${iconLinkBase}/alex-and-charlie.png`} />
const blackBulb = <img alt="" src={`${iconLinkBase}/black-bulb.svg`} />

export const SECTION_NAME_TO_ICON_URL = {
  [USAGE_HIGHLIGHTS]: `${iconLinkBase}/bulb.svg`,
  [PROFESSIONAL_DEVELOPMENT_AND_SUPPORT]: `${iconLinkBase}/students.svg`,
  [ACCOUNT_MANAGEMENT]: `${iconLinkBase}/pencil.svg`,
  [PREMIUM_REPORTS]: `${iconLinkBase}/bar-graph-increasing-black.svg`,
  [INTEGRATIONS]: `${iconLinkBase}/checkbox-multiple.svg`
}

const ERIKA_EMAIL = 'Erika@quill.org'
const SHANNON_EMAIL = 'Shannon@quill.org'

const EMAIL_TO_IMG = {
  [ERIKA_EMAIL]: <img alt="" src={`${iconLinkBase}/erika_headshot.png`} />,
  [SHANNON_EMAIL]: <img alt="" src={`${iconLinkBase}/shannon_headshot.png`} />
}

const EMAIL_TO_SCHEDULE_LINK = {
  [ERIKA_EMAIL]: 'https://calendly.com/erikaatquill/schedule-quill-pd',
  [SHANNON_EMAIL]: 'https://calendly.com/shannonatquill/discuss-scheduling-quill-pd'
}

const premiumReportTiles = [
  {
    name: 'Usage Snapshot Report',
    link: '/teachers/premium_hub/usage_snapshot_report',
    icon: `${iconLinkBase}/usage-snapshot-report.svg`,
    description: 'Key insights to help you succeed. View most assigned activities, average activities completed, and more.',
    new: true
  },
  {
    name: 'Diagnostic Growth Report',
    link: '/teachers/premium_hub/diagnostic_growth_report',
    icon: `${iconLinkBase}/diagnostic-growth-report.svg`,
    description: 'Get a detailed breakdown of Quill’s impact on students’ growth. View data by skill, student, and more.',
    new: true
  },
  {
    name: 'Data Export',
    link: '/teachers/premium_hub/data_export',
    icon: `${iconLinkBase}/data-export.svg`,
    description: 'Download a file containing all activities completed by students. Includes score, time spent, and more.',
    new: true
  },
  {
    name: 'Concepts Report',
    link: '/teachers/premium_hub/district_concept_reports',
    icon: `${iconLinkBase}/concepts-report.svg`,
    description: 'View the number of times a student correctly or incorrectly used a targeted concept.',
  },
  {
    name: 'Activity Scores Report',
    link: '/teachers/premium_hub/district_activity_scores',
    icon: `${iconLinkBase}/activity-scores-report.svg`,
    description: 'View the overall average score for each student per class.',
  },
  {
    name: 'Standards Report',
    link: '/teachers/premium_hub/district_standards_reports',
    icon: `${iconLinkBase}/standards-report.svg`,
    description: 'View a school’s overall progress on each of the Common Core standards.',
  }
]

const integrationTiles = [
  {
    name: 'Canvas',
    link: '/teachers/premium_hub/integrations/canvas',
    icon: `${iconLinkBase}/canvas.svg`,
    description: 'Make teaching at your school even more effective with our seamless Canvas integration.',
  },
  {
    name: 'Google Classroom',
    link: '/teachers/premium_hub/integrations/google',
    icon: `${iconLinkBase}/google-classroom.svg`,
    description: 'Make teaching at your school even more effective with our seamless Google Classroom integration.',
  },
  {
    name: 'Clever',
    link: '/teachers/premium_hub/integrations/clever',
    icon: `${iconLinkBase}/clever.svg`,
    description: 'Make teaching at your school even more effective with our seamless Clever integration.',
  }
]

const DEFAULT_MODEL = { teachers: [] }

const Overview = ({ adminId, accessType, passedModel, }) => {
  const [loading, setLoading] = React.useState(passedModel ? false : true)
  const [model, setModel] = React.useState(passedModel || DEFAULT_MODEL)
  const [error, setError] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [pusherChannel, setPusherChannel] = React.useState(null)
  const [professionalLearningManagerInformation, setProfessionalLearningManagerInformation] = React.useState(null)
  const [loadingProfessionalLearningManagerInformation, setLoadingProfessionalLearningManagerInformation] = React.useState(true)

  React.useEffect(() => {
    getProfessionalLearningManagerInformation()
  }, [])

  React.useEffect(() => {
    getData()
  }, [pusherChannel])

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function getData(skipLoading = false) {
    bindToAdminUsersChannel(skipLoading);
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}`,
      (body) => {
        receiveData(body, skipLoading)
      }
    );
  }

  function getProfessionalLearningManagerInformation() {
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${adminId}/vitally_professional_learning_manager_info`,
      (body) => {
        setProfessionalLearningManagerInformation(body)
        setLoadingProfessionalLearningManagerInformation(false)
      }
    )
  }

  function receiveData(data, skipLoading) {
    if (Object.keys(data).length > 1) {
      setModel(data)
      setLoading(false)
    } else if (!skipLoading) {
      setModel(data)
      setLoading(true)
    }
  };

  function bindToAdminUsersChannel(skipLoading) {
    if (!pusherChannel) { return }
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    pusherChannel.bind('admin-users-found', () => {
      getData(skipLoading)
    });
  };

  function renderSubheader() {
    if (model.schools.length === 0) {
      return (
        <p className="subheader">Thanks for being an admin. We’re excited to have you on board!</p>
      )
    }

    const sortedSchools = model.schools.sort((a, b) => a.name.localeCompare(b.name));

    const associatedSchoolIndex = sortedSchools.findIndex(school => school.id === model.associated_school.id);

    if (associatedSchoolIndex > 0) {
      const [associatedSchool] = sortedSchools.splice(associatedSchoolIndex, 1);
      sortedSchools.unshift(associatedSchool);
    }

    let schoolsText = '';

    if (sortedSchools.length === 1) {
      schoolsText = <b>{sortedSchools[0].name}</b>;
    } else if (sortedSchools.length === 2) {
      schoolsText = <span><b>{sortedSchools[0].name}</b> and <b>{sortedSchools[1].name}</b></span>;
    } else if (sortedSchools.length === 3) {
      schoolsText = <span><b>{sortedSchools[0].name}</b>, <b>{sortedSchools[1].name}</b>, and <b>{sortedSchools[2].name}</b></span>;
    } else {
      const tooltip = (
        <Tooltip
          tooltipText={sortedSchools.slice(2).map(s => s.name).join('<br/>')}
          tooltipTriggerText={<b>{sortedSchools.length - 2} more</b>}
        />
      )
      schoolsText = <span><b>{sortedSchools[0].name}</b>, <b>{sortedSchools[1].name}</b>, and {tooltip}</span>;
    }

    return (
      <p className="subheader">Thanks for being an admin of {schoolsText}.</p>
    )
  }

  function renderHighlights() {
    const snapshotItems = [sentencesWrittenSnapshotInfo, studentLearningHoursSnapshotInfo].map(item => {
      const { label, size, queryKey, headers, singularLabel, } = item
      const props = {
        label,
        queryKey,
        searchCount: 0,
        pusherChannel,
        singularLabel,
        size,
        selectedSchoolIds: model.schools.map(s => s.id),
        labelSubText: <span className="label-sub-text">This school year</span>
      }

      return (
        <SnapshotCount
          {...props}
          key={queryKey}
        />
      )
    })

    return (
      <div className="counts">
        {snapshotItems}
      </div>
    )
  }

  function renderHighlightsSection() {
    return (
      <section className="snapshot-section-wrapper overview-section-wrapper">
        <h2>
          <img alt="" src={SECTION_NAME_TO_ICON_URL[USAGE_HIGHLIGHTS]} />
          <span>{USAGE_HIGHLIGHTS}</span>
        </h2>
        <div className="snapshot-section highlights overview-section">
          <div className="snapshot-section-content overview-section-content">
            {renderHighlights()}
          </div>
        </div>
      </section>
    )
  }

  function renderIntegrationsSection() {
    const tiles = integrationTiles.map(tile => {
      return (
        <div className="tile" key={tile.name}>
          <div>
            <h3>{tile.name}</h3>
            <p>{tile.description}</p>
          </div>
          <div className="link-and-image">
            <Link className="quill-button focus-on-light outlined secondary medium" to={tile.link}>Learn more</Link>
            <img alt="" src={tile.icon} />
          </div>
        </div>
      )
    })

    return (
      <section className="overview-section-wrapper integrations">
        <h2>
          <img alt="" src={SECTION_NAME_TO_ICON_URL[INTEGRATIONS]} />
          <span>{INTEGRATIONS}</span>
        </h2>
        <div className="overview-section">
          <div className="overview-section-content">
            {tiles}
          </div>
        </div>
      </section>
    )
  }

  function renderPremiumReportsSection() {
    const tiles = premiumReportTiles.map(tile => {
      return (
        <div className={`tile ${tile.new ? 'new' : ''}`} key={tile.name}>
          <div>
            <h3>{tile.name}{tile.new ? <span className="new-tag">NEW</span> : null}</h3>
            <p>{tile.description}</p>
          </div>
          <div className="link-and-image">
            <Link className="quill-button focus-on-light outlined secondary medium" to={tile.link}>View report</Link>
            <img alt="" src={tile.icon} />
          </div>
        </div>
      )
    })

    return (
      <section className="overview-section-wrapper premium-reports">
        <h2>
          <img alt="" src={SECTION_NAME_TO_ICON_URL[PREMIUM_REPORTS]} />
          <span>{PREMIUM_REPORTS}</span>
        </h2>
        <div className="overview-section">
          <div className="overview-section-content">
            {tiles}
          </div>
        </div>
      </section>
    )
  }

  function renderProfessionalLearningDevelopmentContent() {
    if (professionalLearningManagerInformation && [ERIKA_EMAIL, SHANNON_EMAIL].includes(professionalLearningManagerInformation.email)) {
      const { name, email, } = professionalLearningManagerInformation

      return (
        <div className="overview-section assigned-professional-learning-manager">
          <div className="professional-learning-manager">
            <div className="text-and-buttons">
              <div>
                <h3>Meet your Professional Learning Manager</h3>
                <p>I am {name}, your main point of contact for Quill implementation questions and scheduling of virtual professional learning opportunities. Please feel free to contact me to discuss how I can best support your district’s Quill journey this year.</p>
              </div>
              <div className="buttons">
                <a className="quill-button contained primary medium focus-on-light" href={`mailto:${email}`} rel="noopener noreferrer" target="_blank">Email me</a>
                <a className="quill-button contained primary medium focus-on-light" href={EMAIL_TO_SCHEDULE_LINK[email]} rel="noopener noreferrer" target="_blank">Schedule a call</a>
              </div>
            </div>
            {EMAIL_TO_IMG[email]}
          </div>
          <div className="quick-links">
            <h3>Quick Links</h3>
            <a href="https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-premium-hub" rel="noopener noreferrer" target="_blank">Premium Hub User Guide</a>
            <a href="https://docsend.com/view/9r6gzp5v8w5ky6w9" rel="noopener noreferrer" target="_blank">Live Training Guide</a>
            <a href="/quill_academy" rel="noopener noreferrer" target="_blank">Quill Academy</a>
            <a href="/teacher-center" rel="noopener noreferrer" target="_blank">Teacher Center</a>
            <a href="mailto:support@quill.org" rel="noopener noreferrer" target="_blank">Contact Support</a>
            <a href="https://quillorg.canny.io/admin-feedback" rel="noopener noreferrer" target="_blank">Request a Feature</a>
          </div>
        </div>
      )
    } else if (accessType === RESTRICTED) {
      return (
        <div className="overview-section restricted-access">
          <div>
            <h3>Implement literacy with fidelity</h3>
            <p className="subheader">{blackBulb}Premium Schools complete three times as many activities as free schools.</p>
            <p>With personalized learning, interactive activities, and immediate feedback, Quill Premium helps teachers foster literacy skills and critical thinking. If you’re interested in Quill Premium for your teachers, our sales team would love to connect with you.</p>
            <div className="buttons">
              <a className="quill-button contained primary medium focus-on-light" href="https://calendly.com/alex-quill" rel="noopener noreferrer" target="_blank">Schedule a call</a>
              <a className="quill-button contained primary medium focus-on-light" href="https://www.quill.org/premium/request-district-quote" rel="noopener noreferrer" target="_blank">Request a quote</a>
            </div>
          </div>
          {alexAndCharlieImg}
        </div>
      )
    } else {
      return (
        <div className="overview-section no-assigned-professional-learning-manager">
          <div>
            <h3>Meet your Quill Implementation Team</h3>
            <p className="subheader">{blackBulb}Premium Schools complete three times as many activities as free schools.</p>
            <p>We are your main point of contact for Quill questions, onboarding needs, and scheduling of virtual training opportunities. Please feel free to contact us to discuss how we can best support your school’s Quill journey this year.</p>
            <div className="buttons">
              <a className="quill-button contained primary medium focus-on-light" href="mailto:schools@quill.org" rel="noopener noreferrer" target="_blank">Email us</a>
              <a className="quill-button contained primary medium focus-on-light" href="https://calendly.com/schoolsatquill" rel="noopener noreferrer" target="_blank">Schedule training</a>
            </div>
          </div>
          {scarletAndNattalieImg}
        </div>
      )
    }
  }

  function renderProfessionalDevelopmentSection() {
    return (
      <section className="overview-section-wrapper professional-development">
        <h2>
          <img alt="" src={SECTION_NAME_TO_ICON_URL[PROFESSIONAL_DEVELOPMENT_AND_SUPPORT]} />
          <span>{PROFESSIONAL_DEVELOPMENT_AND_SUPPORT}</span>
        </h2>
        {renderProfessionalLearningDevelopmentContent()}
      </section>
    )
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="white-background-accommodate-footer premium-hub-overview">
      <div className="container">
        <h1>Hello, {model.name.split(' ')[0]}!</h1>
        {renderSubheader()}
        {renderHighlightsSection()}
        {renderProfessionalDevelopmentSection()}
        {renderPremiumReportsSection()}
        {renderIntegrationsSection()}
      </div>
    </div>
  );
}

export default Overview
