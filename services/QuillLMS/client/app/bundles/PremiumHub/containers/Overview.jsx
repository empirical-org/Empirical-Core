import Pusher from 'pusher-js';
import React from 'react';

import DistrictStandardsReports from './DistrictStandardsReports';

import { requestGet, requestPost, } from '../../../modules/request/index';
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor';
import { Snackbar, defaultSnackbarTimeout, Tooltip, } from '../../Shared/index';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import SnapshotCount from '../components/usage_snapshots/snapshotCount'
import { sentencesWrittenSnapshotInfo, studentLearningHoursSnapshotInfo, } from '../components/usage_snapshots/shared'

const iconLinkBase = `${process.env.CDN_URL}/images/pages/administrator/overview`

const USAGE_HIGHLIGHTS = 'Usage Highlights'

export const SECTION_NAME_TO_ICON_URL = {
  [USAGE_HIGHLIGHTS]: `${iconLinkBase}/bulb.svg`,
}

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

  function renderHighlightSection() {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="white-background-accommodate-footer premium-hub-overview">
      <div className="container">
        <h1>Hello, {model.name.split(' ')[0]}!</h1>
        {renderSubheader()}
        {renderHighlightSection()}
      </div>
    </div>
  );
}

export default Overview
