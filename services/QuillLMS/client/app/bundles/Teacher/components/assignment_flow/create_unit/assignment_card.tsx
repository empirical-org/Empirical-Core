import * as React from 'react';

import { Tooltip, lockedIcon, previewIcon } from '../../../../Shared/index';
import { DISABLED_DIAGNOSTICS } from '../assignmentFlowConstants';

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
}

export default class AssignmentCard extends React.Component<AssignmentCardProps, {}> {

  handleClick = (e) => {
    const { selectCard, lockedText, } = this.props
    if (e.target.tagName !== 'A' && !lockedText) {
      selectCard()
    }
  }

  handleAnchorClick = (e) => e.stopPropagation();

  renderButtons = (isDisabled) => {
    const { buttonText, buttonLink, selectCard, lockedText, header} = this.props;
    /* eslint-disable react/jsx-no-target-blank */
    const button = buttonText && buttonLink ? <a className="interactive-wrapper focus-on-light" href={buttonLink} onClick={this.handleAnchorClick} target="_blank"><img alt={previewIcon.alt} src={previewIcon.src} /><span>{buttonText}</span></a> : null;
    /* eslint-enable react/jsx-no-target-blank */
    const selectButton = <button className="quill-button fun contained primary focus-on-light" onClick={selectCard} type="button">Select</button>
    let lockedButton = <Tooltip tooltipText={lockedText} tooltipTriggerText={<button className="quill-button small disabled contained" type="button"><img alt={lockedIcon.alt} src={lockedIcon.src} /> Locked</button>} />
    if(isDisabled) {
      lockedButton = <button className="quill-button small disabled contained" type="button">Coming Aug 1</button>
    }
    if (button) {
      return (
        <div className="button-container">
          {!isDisabled && button}
          {lockedText || isDisabled ? lockedButton : selectButton}
        </div>
      );
    } else {
      return button;
    }
  }

  render() {
    const { imgSrc, imgAlt, imgClassName, showNewTag, header, bodyArray, showRecommendedToStartTag, } = this.props
    const isDisabled = DISABLED_DIAGNOSTICS.includes(header)
    const bodyElements = bodyArray.map(obj => (
      <div className="body-element" key={obj.key}>
        <p className="key">{obj.key}</p>
        <p className="text">{obj.text}</p>
      </div>)
    )

    const newTag = showNewTag ? <span className="new-tag">NEW</span> : null
    const recommendedToStartTag = showRecommendedToStartTag ? <span className="recommended-to-start-tag">Recommended to start</span> : null
    const leftClassName = showRecommendedToStartTag ? "left include-recommended-to-start-tag" : "left"

    return (
      <div className={`${newTag ? 'show-new-tag' : ''} assignment-card quill-card`} onClick={isDisabled ? null : this.handleClick}>
        {newTag}
        <div className="top-row">
          <div className={leftClassName}>
            {imgSrc && <img alt={imgAlt} className={imgClassName} src={imgSrc} />}
            <div className="header-wrapper">
              {recommendedToStartTag}
              <h2>{header}</h2>
            </div>
          </div>
          {this.renderButtons(isDisabled)}
        </div>
        <div className="body">
          {bodyElements}
        </div>
      </div>
    )
  }
}
