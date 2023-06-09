import * as React from 'react';

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`;

interface ExpandableCardProps {
  imgSrc: string,
  imgAlt: string,
  isExpanded: boolean,
  onClick: (event: React.SyntheticEvent<HTMLButtonElement | HTMLDivElement>) => void,
  header: string,
  text:string,
  rows: {
    imgAlt: string,
    imgSrc: string,
    name: string,
    onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void
  }[]
}

export const ExpandableCard = ({ imgSrc, imgAlt, isExpanded, onClick, header, text, rows }: ExpandableCardProps) => {

  function handleKeyDown(e) {
    if (e.key !== 'Enter') { return }
    if (e.target.value === 'row-button') { return }
    onClick(e);
  }
  function renderExpandedSection() {
    if(!rows) { return }
    return(
      <section className="expanded-section">
        {rows.map((row, i) => {
          const { imgAlt, imgSrc, name, onClick } = row;
          return(
            <section className="row-section" key={`${name}-${i}`}>
              <button className="row-name-button" onClick={onClick} type="button">
                <p className="row-name-label">{name}</p>
              </button>
              <button className="row-button focus-on-light" onClick={onClick} type="button" value="row-button">
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
    <div className={cardClass} onClick={onClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
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
