import React from 'react';

import Notification from './notification';

const NotificationFeed = ({ notifications, }) => {
  if (notifications.length > 0) {
    return (
      <div className="mini_container results-overview-mini-container col-md-4 col-sm-5">
        <div className="mini_content notifications_content">
          <div className="gray-underline text-center">
            <h4>Notifications</h4>
          </div>
          <ul style={styles.list}>
            {notifications.map(notification => (<li style={styles.listItem}>
              <Notification {...notification} />
            </li>))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  list: {
    'listStyle': 'none',
    'padding': '5px 10px',
  },
  listItem: {
    borderBottom: '1px solid #efefef',
    padding: '5px 0px'
  }
}

export default NotificationFeed;
