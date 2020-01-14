import React, { Component } from 'react';
const beginArrow = 'https://assets.quill.org/images/icons/begin_arrow.svg';
import translations from '../../libs/translations/index.js';

export interface ComponentProps {
  data: any
  language: string
  handleContinueClick(): void
}

class TitleCard extends Component<ComponentProps, any> {

  getContentHTML() {
    const { data, language, } = this.props
    let html = data.content ? data.content : translations.english[data.key];
    if (language !== 'english') {
      const textClass = language === 'arabic' ? 'right-to-left arabic-title-div' : '';
      html += `<br/><div class="${textClass}">${translations[language][data.key]}</div>`;
    }
    return html;
  }

  getButtonText() {
    const { language, } = this.props
    let text = translations.english['continue button text']
    if (language !== 'english') {
      text += ` / ${translations[language]['continue button text']}`
    }
    return text
  }

  render() {
    const { handleContinueClick, } = this.props
    return (
      <div className="landing-page">
        <div className="landing-page-html" dangerouslySetInnerHTML={{ __html: this.getContentHTML(), }} />
        <button className="quill-button large contained primary" onClick={handleContinueClick} type="button">
          {this.getButtonText()}
        </button>
      </div>
    );
  }
}

export default TitleCard;
