import React from 'react';
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import NotificationsCard from './notification_feed';

import client from '../../../../../modules/apollo';

export interface Notification {
  id: number
  text: string
  href: string|null
}

const notificationQuery:string = `
  {
    currentUser {
      notifications {
        id
        text
        href
      }
    }
  }
`

export default () => (
  <ApolloProvider client={client}>
    <Query
      query={gql(notificationQuery)}
    >
      {({ loading, error, data }) => {
        if (loading) return (null);
        if (error) return <p>Error :(</p>;
        const notifications:Notification[] = data.currentUser.notifications;
        return (
          <NotificationsCard notifications={notifications} />
        )
      }}
    </Query>
  </ApolloProvider>
);