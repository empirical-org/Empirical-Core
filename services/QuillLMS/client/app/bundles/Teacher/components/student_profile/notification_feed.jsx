import React from 'react';

import Notification from './notification';

const NotificationFeed = ({ notifications }) => {
  if (notifications) {
    return(
      <ul>
        {notifications.map((notification) => (<li>
          <Notification {...notification} />
        </li>))}
      </ul>
    );
  }

  return null;
};

export default NotificationFeed;
