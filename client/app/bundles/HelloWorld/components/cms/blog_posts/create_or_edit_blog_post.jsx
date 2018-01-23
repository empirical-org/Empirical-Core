import React from 'react';
import request from 'request';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      subtitle: null,
      body: null,
      authorId: null,
      topic: null,
    };
  }

  render() {
    return (<div>'here i am'</div>)
  }
}
