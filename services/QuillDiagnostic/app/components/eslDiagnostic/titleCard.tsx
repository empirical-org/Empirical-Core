import React, { Component } from 'react';
const beginArrow = 'http://cdn.quill.org/images/icons/begin_arrow.svg';
import translations from '../../libs/translations/index.js';

class TitleCard extends Component {

  getContentHTML() {
    let html = this.props.data.content ? this.props.data.content : translations.english[this.props.data.key];
    if (this.props.language !== 'english') {
      const textClass = this.props.language === 'arabic' ? 'right-to-left arabic-title-div' : '';
      html += `<br/><div class="${textClass}">${translations[this.props.language][this.props.data.key]}</div>`;
    }
    return html;
  }

  getButtonText() {
    let text = translations.english['continue button text']
    if (this.props.language !== 'english') {
      text += ` / ${translations[this.props.language]['continue button text']}`
    }
    return text
  }

  render() {
    return (
      <div className="landing-page">
        <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: this.getContentHTML(), }} />
        <button className="button student-begin" onClick={this.props.nextQuestion}>
          {this.getButtonText()}
          <img className="begin-arrow" src={beginArrow} />
        </button>
      </div>
    );
  }
}

export default TitleCard;
