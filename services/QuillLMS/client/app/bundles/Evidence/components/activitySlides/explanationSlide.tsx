import * as React from "react";

import Footer from './footer';

export const ExplanationSlide = ({ slideData, onHandleClick }) => {
  const { buttonText, header, imageData, isBeta, step, subtext } = slideData;
  const { imageAlt, imageUrl } = imageData;

  return(
    <div aria-live="polite" className="explanation-slide-container">
      <section id="information-section">
        <p className="subtext">Good to know</p>
        <section id="header-container">
          <p id="header">{header}</p>
          {isBeta && <div id="beta-tag">BETA</div>}
        </section>
        <img alt={imageAlt} id="image" src={`${process.env.CDN_URL}/${imageUrl}`} />
        <p className="subtext">{subtext}</p>
      </section>
      <Footer buttonText={buttonText} onHandleClick={onHandleClick} step={step} />
    </div>
  );
}

export default ExplanationSlide;
