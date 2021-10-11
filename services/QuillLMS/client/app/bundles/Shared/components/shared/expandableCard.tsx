import * as React from 'react'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

export const ExpandableCard = ({ imgSrc, imgAlt, isExpanded, onClick, header, text, rows }) => {

  function handleKeyDownOnCard(e) {
    if (e.key !== 'Enter') { return }
    onClick(e);
  }
  function renderExpandedSection() {
    return(
      <section className="expanded-section">
        open.
      </section>
    );
  }

  const img = imgSrc ? <img alt={imgAlt} className="expandable-card-icon" src={imgSrc} /> : null;
  const cardClass = `expandable-quill-card ${isExpanded ? 'open' : ''}`;

  return (
    <div className={cardClass} onClick={onClick} onKeyDown={handleKeyDownOnCard} role="button" tabIndex={0}>
      <section className="upper-content-section">
        {img}
        <div className="text">
          <h3>{header}</h3>
          <p>{text}</p>
        </div>
        <img alt="arrow" className="expand-arrow" src={expandSrc} />
      </section>
      {isExpanded && renderExpandedSection()}
    </div>
  )
}

export default ExpandableCard;
