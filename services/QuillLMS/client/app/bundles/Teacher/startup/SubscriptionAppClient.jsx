import React from 'react';
import SubscriptionHistory from '../components/subscriptions/subscription_history.jsx';
import EditOrCreateSubscription from '../containers/EditOrCreateSubscription.jsx';
import Subscriptions from '../containers/Subscriptions.jsx';

export default (props) => {
  if (props.view === 'new' || props.view === 'edit') {
    return <EditOrCreateSubscription {...props} />;
  } else if (props.view === 'subscriptionHistory') {
    return <SubscriptionHistory {...props} />;
  }
  return <Subscriptions {...props} />;
};
