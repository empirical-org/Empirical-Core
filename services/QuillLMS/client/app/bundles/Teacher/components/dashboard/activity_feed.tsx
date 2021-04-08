import React from 'react';

import { requestGet } from '../../../../modules/request';

const listIllustrationSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-list.svg`

const ActivityFeed = ({ }) => {
  const [activityFeed, setActivityFeed] = React.useState([])

  React.useEffect(() => {
    getActivityFeed()
  }, []);

  function getActivityFeed() {
    requestGet('/activity_feed',
      (response) => {
        setActivityFeed(response.data);
      }
    )
  }

  if (activityFeed.length === 0) {
    return (<section className="activity-feed empty">
      <img alt="Document with a bulleted list illustration" src={listIllustrationSrc} />
      <h2>Activity feed</h2>
      <p>Once your students complete activities, you’ll be able to see them here.</p>
    </section>)
  }

}

export default ActivityFeed
