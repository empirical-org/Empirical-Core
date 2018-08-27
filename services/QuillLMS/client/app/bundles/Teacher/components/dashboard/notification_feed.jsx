import React from 'react';
import Notification from './notification';

const NotificationFeed = ({ notifications }) => {
  if (notifications) {
    return(
      <div className="mini_container results-overview-mini-container col-md-4 col-sm-5 text-center">
        <div className="mini_content">
          <div className="gray-underline">
            <h4>Notification Feed</h4>
          </div>
          <ul style={{'list-style': 'none', padding: '5px'}}>
            {notifications.map((notification) => <li>
              <Notification {...notification} />
              <hr style={{margin: '5px'}}></hr>
            </li>)}
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default NotificationFeed;
