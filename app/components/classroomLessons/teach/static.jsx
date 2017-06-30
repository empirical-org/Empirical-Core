import React, { Component } from 'react';
import ScriptComponent from '../shared/scriptComponent.tsx';

class Static extends Component {
  constructor(props) {
    super(props);
  }

  renderScript(script) {
    return script.map(item => (
      <li className="script-item">
        <p>{item.data.heading}</p>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: item.data.body, }} />
      </li>
      ));
  }

  render() {
    return (
      <div>
        <h4 className="title is-4">
          Title goes here.
        </h4>
        <ul>
          <ScriptComponent script={this.props.data.questions[this.props.data.current_slide].data.teach.script} />
        </ul>
      </div>
    );
  }

}

export default Static;
