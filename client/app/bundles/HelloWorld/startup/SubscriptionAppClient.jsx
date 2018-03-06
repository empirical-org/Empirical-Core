import React from 'react';
import Subscriptions from '../containers/Subscriptions.jsx';
import EditOrCreateSubscription from '../containers/EditOrCreateSubscription.jsx';

export default (props) => {
  if (props.view === 'create' || props.view === 'edit') {
    return <EditOrCreateSubscription {...props} />;
  }
  return <Subscriptions {...props} />;
};
