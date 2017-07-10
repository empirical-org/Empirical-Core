import React, { Component } from 'react';

class Static extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="student-static-page-container"><div className="student-static-page" dangerouslySetInnerHTML={{ __html: this.props.data.play.html, }} /></div>
    );
  }

}

export default Static;
