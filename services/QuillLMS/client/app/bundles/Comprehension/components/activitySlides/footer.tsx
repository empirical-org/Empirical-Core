import * as React from "react";

export const Footer = ({ buttonText, onHandleClick, step }) => {

  function handleClick() {
    onHandleClick();
  }

  return(
    <section id="button-container">
      <span />
      <button className="quill-button large secondary outlined focus-on-dark" onClick={handleClick} type="submit">{buttonText}</button>
      <div id="step-indictator-container">
        <div className={`step-indicator ${step === 1 ? 'active' : ''}`} />
        <div className={`step-indicator ${step === 2 ? 'active' : ''}`} />
        <div className={`step-indicator ${step === 3 ? 'active' : ''}`} />
        <div className={`step-indicator ${step === 4 ? 'active' : ''}`} />
      </div>
    </section>
  );
}

export default Footer;
