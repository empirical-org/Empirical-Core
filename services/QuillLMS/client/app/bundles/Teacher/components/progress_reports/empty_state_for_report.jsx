import React from 'react';

const EmptyState = () => (
 <div className='empty-state-for-report'>
    <img className="no-report-image" src={`${process.env.CDN_URL}/images/illustrations/empty-state-premium-reports.svg`} />
    <h2>You have no reports yet!</h2>
    <p className='text-center'>
      Once your students have completed their assigned activities, their reports will be displayed here.
    </p>
 </div>
);

export default EmptyState;
