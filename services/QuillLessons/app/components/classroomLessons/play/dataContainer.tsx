import React from 'react';
import PlayContainer from './playContainer';

import SessionSubscriptionComponent from '../shared/sessionSubscriptionComponent';

class StudentDataContainer extends React.Component {
  render() {
    return (
      <SessionSubscriptionComponent params={this.props.params}>
        <PlayContainer/>
      </SessionSubscriptionComponent>
    )
  }
}

export default StudentDataContainer;