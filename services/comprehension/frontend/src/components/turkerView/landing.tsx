import * as React from "react";

const TurkLanding = () => {
  return(
    <div className="turk-landing-container">
      <div className="turk-landing-header-container">
        <h1>Amazon Mechanical Turk Task</h1>
        <p>You are completing a reading and writing activity. Your responses will be used to develop our system so that millions of students around the world can improve their reading and writing skills.</p>
      </div>
      <div className="turk-landing-directions-container">
        <h1>Directions:</h1>
        <p>In order to accurately complete the HIT for payment, you <p>must</p> do the following:</p>
        <ul>
          <li>
            <p>Read the passage</p>
          </li>
          <li>
            <p>Complete all three sentences</p>
          </li>
          <li>
            <p>Analyze the feedback provided</p>
          </li>
          <li>
            <p>Use the feedback to revise each sentence up to <p>five</p> times</p>
          </li>
        </ul>
        <p>Each of your sentences <p>must</p>:</p>
        <ul>
          <li>
            <p>Be <p>one</p> sentence long</p>
          </li>
          <li>
            <p>Use proper capitalization (i.e. do not write in capital letters)</p>
          </li>
          <li>
            <p>Be based on the text, but written in your own words</p>
          </li>
        </ul>
        <p>By following these directions, you will be provided with a code to input in order to be paid for the HIT.</p>
      </div>
      <button className="quill-button small primary contained" type="button">Start Activity</button>
    </div>
  )
}

export default TurkLanding;
