import * as React from "react";
const checkIcon = <img alt="check icon" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/check-circle-big.svg`} />;

const ListElement = (text: string, textArray?: string[], style?: string) => {
  const textElement = textArray ? <div className={style}>{textArray[0]}<p>{text}</p>{textArray[1]}</div> : <p>{text}</p>;
  return(
    <li>
      {checkIcon}
      {textElement}
    </li>
  );
}

export const TurkLanding = ({ handleStartActivity}) => {
  return(
    <section className="turk-landing-container">
      <section className="turk-landing-header-container">
        <h1>Quill Activity - Beta Testing of New Content</h1>
        <p>You are completing a reading and writing activity. Your responses will be used to develop our system so that millions of students around the world can improve their reading and writing skills.</p>
      </section>
      <section className="turk-landing-directions-container">
        <h1>Directions:</h1>
        <div className="bolded">You should:</div>
        <ul>
          {ListElement('Read the passage')}
          {ListElement('Complete all three sentences')}
          {ListElement('Analyze the feedback provided')}
          {ListElement('five', ['Use the feedback to revise each sentence up to', ' times'])}
        </ul>
        <div className="bolded">Each of your sentences <p>must</p></div>
        <ul>
          {ListElement('one', ['Be ', ' sentence long'])}
          {ListElement('Use proper capitalization (i.e. do not write in capital letters)')}
          {ListElement('Be based on the text, but written in your own words')}
        </ul>
      </section>
      <section className="button-container">
        <button
          className="quill-button small primary contained focus-on-light"
          onClick={handleStartActivity}
          type="button"
        >Start Activity</button>
      </section>
    </section>
  )
}

export default TurkLanding;
