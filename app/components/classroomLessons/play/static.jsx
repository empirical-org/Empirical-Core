import React, { Component } from 'react';

class Static extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.data.play.html, }} />
    );
  }

}

export default Static;
