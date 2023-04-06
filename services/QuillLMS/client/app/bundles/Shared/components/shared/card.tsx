import * as React from 'react';

interface CardProps {
  onClick: (event: any) => void;
  imgSrc?: string;
  imgAlt?: string;
  header: string;
  text: string;
}

export class Card extends React.Component<CardProps, {}> {
  handleKeyDownOnCard = (e) => {
    if (e.key !== 'Enter') { return }

    const { onClick, } = this.props
    onClick(e)
  }

  render() {
    const { imgSrc, imgAlt, onClick, header, text, } = this.props
    const img = imgSrc ? <img alt={imgAlt} src={imgSrc} /> : null
    return (
      <div className="quill-card" onClick={onClick} onKeyDown={this.handleKeyDownOnCard} role="button" tabIndex={0}>
        {img}
        <div className="text">
          <h3>{header}</h3>
          <p>{text}</p>
        </div>
      </div>
    )
  }
}
