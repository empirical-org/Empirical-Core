import * as React from 'react'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

export const ExpandableCard = ({ imgSrc, imgAlt, isExpanded, onClick, header, text, rows }) => {

  function handleKeyDownOnCard(e) {
    if (e.key !== 'Enter') { return }
    if (e.target.value === 'row-button') { return }
    onClick(e);
  }
  function renderExpandedSection() {
    if(!rows) { return }
    return(
      <section className="expanded-section">
        {rows.map((row, i) => {
          const { name, imgSrc, imgAlt } = row;
          return(
            <section className="row-section" key={`${name}-${i}`}>
              <p className="row-name">{name}</p>
              <button className="row-button focus-on-light" type="button" value="row-button">
                <img alt={imgAlt} src={imgSrc} />
              </button>
            </section>
          )
        })}
      </section>
    );
  }

  const img = imgSrc ? <img alt={imgAlt} className="expandable-card-icon" src={imgSrc} /> : null;
  const cardClass = `expandable-quill-card ${isExpanded ? 'open' : ''}`;

  return (
    <div className={cardClass} onKeyDown={handleKeyDownOnCard} role="button" tabIndex={0}>
      <section className="upper-content-section">
        {img}
        <div className="text">
          <h3>{header}</h3>
          <p>{text}</p>
        </div>
        <button className="expand-button focus-on-light" onClick={onClick} type="button">
          <img alt="arrow" className="expand-arrow" src={expandSrc} />
        </button>
      </section>
      {isExpanded && renderExpandedSection()}
    </div>
  )
}

export default ExpandableCard;
