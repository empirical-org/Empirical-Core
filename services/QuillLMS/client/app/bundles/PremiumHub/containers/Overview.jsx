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

const iconLinkBase = `${process.env.CDN_URL}/images/pages/administrator/overview`

const USAGE_HIGHLIGHTS = 'Usage Highlights'
const PROFESSIONAL_DEVELOPMENT_AND_SUPPORT = 'Professional Development and Support'
const ACCOUNT_MANAGEMENT = 'Account Management'
const PREMIUM_REPORTS = 'Premium Reports'
const INTEGRATIONS = 'Integrations'

export const SECTION_NAME_TO_ICON_URL = {
  [USAGE_HIGHLIGHTS]: `${iconLinkBase}/bulb.svg`,
  [PROFESSIONAL_DEVELOPMENT_AND_SUPPORT]: `${iconLinkBase}/students.svg`,
  [ACCOUNT_MANAGEMENT]: `${iconLinkBase}/pencil.svg`,
  [PREMIUM_REPORTS]: `${iconLinkBase}/bar-graph-increasing.svg`,
  [INTEGRATIONS]: `${iconLinkBase}/checkbox-multiple.svg`
}

const premiumReportTiles = [
  {
    name: 'Usage Snapshot Report',
    link: '/teachers/premium_hub/usage_snapshot_report',
    icon: `${iconLinkBase}/usage-snapshot-report.svg`,
    description: 'Create new accounts, manage admins, and more.',
    new: true
  },
  {
    name: 'Diagnostic Growth Report',
    link: '/teachers/premium_hub/diagnostic_growth_report',
    icon: `${iconLinkBase}/diagnostic-growth-report.svg`,
    description: 'Access each teacher’s account to assign activities, manage rosters, and view data.',
    new: true
  },
  {
    name: 'Data Export',
    link: '/teachers/premium_hub/data_export',
    icon: `${iconLinkBase}/data-export.svg`,
    description: 'View subscription history, manage subscriptions, and more.',
    new: true
  },
  {
    name: 'Concepts Report',
    link: '/teachers/premium_hub/district_concept_reports',
    icon: `${iconLinkBase}/concepts-report.svg`,
    description: 'Create new accounts, manage admins, and more.',
  },
  {
    name: 'Activity Scores Report',
    link: '/teachers/premium_hub/district_activity_scores',
    icon: `${iconLinkBase}/activity-scores-report.svg`,
    description: 'Access each teacher’s account to assign activities, manage rosters, and view data.',
  },
  {
    name: 'Standards Report',
    link: '/teachers/premium_hub/district_standards_reports',
    icon: `${iconLinkBase}/standards-report.svg`,
    description: 'View subscription history, manage subscriptions, and more.',
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

  React.useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    setPusherChannel(channel)
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="white-background-accommodate-footer premium-hub-overview">
      <div className="container">
        <h1>Hello, {model.name.split(' ')[0]}!</h1>
        {renderSubheader()}
        {renderHighlightsSection()}
        {renderIntegrationsSection()}
      </div>
    </div>
  );
}

export default Overview
