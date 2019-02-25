import React from 'react';
import TeachContainer from './teachContainer';

import SessionSubscriptionComponent from '../shared/sessionSubscriptionComponent';
class TeacherContainer extends React.Component {
  render() {
    return (
      <SessionSubscriptionComponent params={this.props.params}>
        <TeachContainer/>
      </SessionSubscriptionComponent>
    )
  }
}

export default TeacherContainer;