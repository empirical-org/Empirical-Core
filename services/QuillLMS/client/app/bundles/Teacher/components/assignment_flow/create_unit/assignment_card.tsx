import * as React from 'react'

interface AssignmentCardProps {
  selectCard?: () => void;
  imgSrc: string;
  imgAlt: string;
  header: string;
  bodyArray: Array<{ key: string, text: string }>;
  buttonText?: string;
  buttonLink?: string;
  imgClassName?: string;
  showNewTag?: boolean;
  showRecommendedToStartTag?: boolean;
}

export default class AssignmentCard extends React.Component<AssignmentCardProps, {}> {

  handleClick = (e) => {
    const { selectCard, } = this.props
    if (e.target.tagName !== 'A') {
      selectCard()
    }
  }

  renderButtons = () => {
    const { buttonText, buttonLink, selectCard } = this.props;
    /* eslint-disable react/jsx-no-target-blank */
    const button = buttonText && buttonLink ? <a className="quill-button fun outlined secondary" href={buttonLink} target="_blank">{buttonText}</a> : null;
    /* eslint-enable react/jsx-no-target-blank */
    if (button) {
      return (
        <div className="button-container">
          {button}
          <a className="quill-button fun contained primary" onClick={selectCard} target="_blank">Select</a>
        </div>
      );
    } else {
      return button;
    }
  }

  render() {
    const { imgSrc, imgAlt, imgClassName, showNewTag, header, bodyArray, showRecommendedToStartTag, } = this.props
    const bodyElements = bodyArray.map(obj => (
      <div className="body-element" key={obj.key}>
        <p className="key">{obj.key}</p>
        <p className="text">{obj.text}</p>
      </div>)
    )

    const newTag = showNewTag ? <span className="new-tag">NEW</span> : null
    const recommendedToStartTag = showRecommendedToStartTag ? <span className="recommended-to-start-tag">Recommended to start</span> : null
    const leftClassName = showRecommendedToStartTag ? "left include-recommended-to-start-tag" : "left"

    return (<div className="assignment-card quill-card" onClick={this.handleClick}>
      <div className="top-row">
        <div className={leftClassName}>
          <img alt={imgAlt} className={imgClassName} src={imgSrc} />
          <div className="header-wrapper">
            {recommendedToStartTag}
            <h2>{header}</h2>
          </div>
          {newTag}
        </div>
        {this.renderButtons()}
      </div>
      <div className="body">
        {bodyElements}
      </div>
    </div>)
  }
}
