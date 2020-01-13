import * as React from 'react'

interface AssignmentCardProps {
  selectCard?: () => void;
  imgSrc: string;
  imgAlt: string;
  header: string;
  bodyArray: Array<{ key: string, text: string }>;
  buttonText?: string;
  buttonLink?: string;
}

export default class AssignmentCard extends React.Component<AssignmentCardProps, {}> {

  handleClick = (e) => {
    const { selectCard, } = this.props
    if (e.target.tagName !== 'A') {
      selectCard()
    }
  }

  render() {
    const { imgSrc, imgAlt, header, bodyArray, buttonText, buttonLink, } = this.props
    /* eslint-disable react/jsx-no-target-blank */
    const button = buttonText && buttonLink ? <a className="quill-button fun outlined secondary" href={buttonLink} target="_blank">{buttonText}</a> : null
    /* eslint-enable react/jsx-no-target-blank */
    const bodyElements = bodyArray.map(obj => (
      <div className="body-element" key={obj.key}>
        <p className="key">{obj.key}</p>
        <p className="text">{obj.text}</p>
      </div>)
    )

    return (<div className="assignment-card quill-card" onClick={this.handleClick}>
      <div className="top-row">
        <div className="left">
          <img alt={imgAlt} src={imgSrc} />
          <h2>{header}</h2>
        </div>
        {button}
      </div>
      <div className="body">
        {bodyElements}
      </div>
    </div>)
  }
}
