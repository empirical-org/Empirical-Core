import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLanguage } from '../../actions/diagnostics.js';

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
  }

  updateLanguage(event) {
    const language = event.target.value;
    this.props.dispatch(updateLanguage(language));
  }

  render() {
    return (
      <div>
        <select name="language" value={this.props.playDiagnostic.language} onChange={event => this.updateLanguage(event)}>
          <option value="english"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />English</option>
          <option value="spanish"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />Español</option>
          <option value="chinese"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png" />中文</option>
          <option value="french"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png" />Français</option>
          <option value="vietnamese"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png" />Tiếng Việt</option>
          <option value="arabic"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png" />العربي</option>
          <option value="hindi"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png" />हिंद</option>
        </select>
      </div>
    );
  }

}

function select(props) {
  return {
    playDiagnostic: props.playDiagnostic,
  };
}

export default connect(select)(LanguageSelector);
