import * as React from 'react';

import { Tooltip, lockedIcon, previewIcon, } from '../../../../Shared/index';

interface AssignmentCardProps {
  selectCard?: () => void;
  imgSrc?: string;
  imgAlt?: string;
  header: string;
  bodyArray: Array<{ key: string, text: string }>;
  buttonText?: string;
  buttonLink?: string;
  imgClassName?: string;
  showNewTag?: boolean;
  showRecommendedToStartTag?: boolean;
  lockedText?: string;
  preHeader?: string;
  showNewTagInPreHeaderLine?: boolean;
}

export default class AssignmentCard extends React.Component<AssignmentCardProps, {}> {

  handleClick = (e) => {
    const { selectCard, lockedText, } = this.props
    if (e.target.tagName !== 'A' && !lockedText) {
      selectCard()
    }
  }

  handleAnchorClick = (e) => e.stopPropagation();

  renderButtons = () => {
    const { buttonText, buttonLink, selectCard, lockedText, } = this.props;
    /* eslint-disable react/jsx-no-target-blank */
    const button = buttonText && buttonLink ? <a className="interactive-wrapper focus-on-light" href={buttonLink} onClick={this.handleAnchorClick} target="_blank"><img alt={previewIcon.alt} src={previewIcon.src} /><span>{buttonText}</span></a> : null;
    /* eslint-enable react/jsx-no-target-blank */
    const selectButton = <button className="quill-button-archived fun contained primary focus-on-light" onClick={selectCard} type="button">Select</button>
    const lockedButton = <Tooltip tooltipText={lockedText} tooltipTriggerText={<button className="quill-button-archived small disabled contained" type="button"><img alt={lockedIcon.alt} src={lockedIcon.src} /> Locked</button>} />
    if (button) {
      return (
        <div className="button-container">
          {button}
          {lockedText ? lockedButton : selectButton}
        </div>
      );
    } else {
      return button;
    }
  }

  render() {
    const { imgSrc, imgAlt, imgClassName, showNewTag, header, bodyArray, showRecommendedToStartTag, preHeader, showNewTagInPreHeaderLine, } = this.props
    const bodyElements = bodyArray.map(obj => (
      <div className="body-element" key={obj.key}>
        <p className="key">{obj.key}</p>
        <p className="text">{obj.text}</p>
      </div>)
    )

    const newTagElement = <span className="new-tag">NEW</span>
    const newTag = showNewTag ? newTagElement : null
    const newTagInPreHeaderLine = showNewTagInPreHeaderLine ? newTagElement : null
    const recommendedToStartTag = showRecommendedToStartTag ? <span className="recommended-to-start-tag">Recommended to start</span> : null
    const preHeaderTag = preHeader ? <span className="pre-header">{preHeader}</span> : null
    const leftClassName = showRecommendedToStartTag ? "left include-recommended-to-start-tag" : "left"

    return (
      <div className={`${newTag ? 'show-new-tag' : ''} assignment-card quill-card`} onClick={this.handleClick}>
        {newTag}
        <div className="top-row">
          <div className={leftClassName}>
            {imgSrc && <img alt={imgAlt} className={imgClassName} src={imgSrc} />}
            <div className="header-wrapper">
              {recommendedToStartTag}
              {preHeaderTag ? <div className="pre-header-wrapper">{preHeaderTag}{newTagInPreHeaderLine}</div> : null}
              <h2>{header}</h2>
            </div>
          </div>
          {this.renderButtons()}
        </div>
        <div className="body">
          {bodyElements}
        </div>
      </div>
    )
  }
}
