import * as React from "react";

export const ExplanationSlide = ({ slideData, onHandleClick }) => {
  const { buttonText, header, imageData, isBeta, step, subtext } = slideData;
  const { imageAlt, imageUrl } = imageData;

  function handleClick() {
    onHandleClick();
  }

  return(
    <div className="explanation-slide-container">
      <section id="information-section">
        <p className="subtext">Good to know</p>
        <section id="header-container">
          <p id="header">{header}</p>
          {isBeta && <div id="beta-tag">BETA</div>}
        </section>
        <img alt={imageAlt} id="image" src={`${process.env.CDN_URL}/${imageUrl}`} />
        <p className="subtext">{subtext}</p>
      </section>
      <section id="button-container">
        <span />
        <button className="quill-button large secondary outlined" onClick={handleClick} type="submit">{buttonText}</button>
        <div id="step-indictator-container">
          <div className="step-indicator" />
          <div className={`step-indicator ${step === 1 ? 'active' : ''}`} />
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`} />
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`} />
        </div>
      </section>
    </div>
  );
}

export default ExplanationSlide;
