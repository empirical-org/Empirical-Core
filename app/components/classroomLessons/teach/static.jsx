import React, { Component } from 'react';

class Static extends Component {
  constructor(props) {
    super(props);
  }

  renderScript(script) {
    return script.map((item, index) => (
      <li key={`${item.type + index.toString()}`}>
        {item.text}
      </li>
      ));
  }

  render() {
    return (
      <div>
        <h1>
          Static Page
        </h1>
        <ul>
          {this.renderScript(this.props.data.questions[this.props.data.current_slide].data.teach.script)}
        </ul>
      </div>
    );
  }

}

export default Static;
