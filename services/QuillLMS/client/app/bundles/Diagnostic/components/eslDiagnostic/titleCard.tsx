import React, { Component } from 'react';

import { commonText } from '../../modules/translation/commonText';
import { ENGLISH, rightToLeftLanguages } from '../../modules/translation/languagePageInfo';

export interface ComponentProps {
  data: any,
  language: string,
  isLastQuestion: boolean,
  handleContinueClick(): void,
  previewMode: boolean,
  translate(input: string): any
}

class TitleCard extends Component<ComponentProps, any> {

  renderContent = () => {
    const { data, language, translate } = this.props;
    const { title } = data;
    const header = `${title}^header`;
    const text = `${title}^text`;
    const textClass = rightToLeftLanguages.includes(language) ? 'right-to-left' : '';

    return(
      <div>
        <div className="landing-page-html">
          <h1>{commonText[title].header}</h1>
          <p>{commonText[title].text}</p>
        </div>
        {language && language !== ENGLISH && <div className={`landing-page-html ${textClass}`}>
          <h1>{translate(header)}</h1>
          <p>{translate(text)}</p>
        </div>}
      </div>
    );
  }

  render() {
    const { handleContinueClick, translate, isLastQuestion, previewMode } = this.props;
    const buttonText = isLastQuestion ? translate('buttons^next') : translate('buttons^continue');
    const disabled = previewMode && isLastQuestion ? 'disabled' : '';

    return (
      <div className="landing-page">
        {this.renderContent()}
        <button className={`quill-button focus-on-light large contained primary ${disabled}`} onClick={handleContinueClick} type="button">
          {buttonText}
        </button>
      </div>
    );
  }
}

export default TitleCard;
