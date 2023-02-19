import React from 'react';

const EmptyState = ({ title, body, }) => (
  <div className="empty-state-for-report">
    <img alt="" className="no-report-image" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/empty-state-premium-reports.svg`} />
    <h2>{title || 'You have no reports yet!'}</h2>
    <p className="text-center">
      {body || 'Once your students have completed their assigned activities, their reports will be displayed here.'}
    </p>
  </div>
);

export default EmptyState;
