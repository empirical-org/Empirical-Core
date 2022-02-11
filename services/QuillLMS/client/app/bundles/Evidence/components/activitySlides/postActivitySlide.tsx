import * as React from "react";

import { BECAUSE, BUT, SO } from '../../../Shared/index'
import { PromptInterface } from "../../../Staff/interfaces/evidenceInterfaces";

const FIRST_STRONG_EXAMPLE = 'first_strong_example';
const SECOND_STRONG_EXAMPLE = 'second_strong_example';
const conjunctions = [BECAUSE, BUT, SO];

const responses = {
  1: [
    {
      entry: "A surge barrier in New York City could harm the local ecosystem because this is a test response ."
    },
    {
      entry: "A surge barrier in New York City could harm the local ecosystem because this is a test response."
    }
  ],
  2: [
    {
      entry: "A surge barrier in New York City could harm the local ecosystem, but this is a test response."
    }
  ],
  3: [
    {
      entry: "A surge barrier in New York City could harm the local ecosystem, so this is a shit response."
    },
    {
      entry: "A surge barrier in New York City could harm the local ecosystem, so this is a shit response ."
    },
    {
      entry: "A surge barrier in New York City could harm the local ecosystem, so this is a shirt response."
    }
  ]
}

interface PostActivitySlideProps {
  handleClick: () => void,
  prompts: PromptInterface[],
  responses: any
}

export const PostActivitySlide = ({ handleClick, prompts }: PostActivitySlideProps) => {

  function getStrongExemplar(conjunction: string, property: string) {
    const prompt = prompts.filter(prompt => prompt.conjunction === conjunction)[0];
    if (!prompt) { return }
    const stemWithoutConjunction = prompt.text.replace(conjunction, '');
    const exemplar = prompt[property];
    return <p>{stemWithoutConjunction}<u>{conjunction}</u>{exemplar}</p>;
  }

  function getResponsesForConjunction(conjunction: string) {
    const responsesKeyHash = {}
    const responsesKeys = Object.keys(responses);
    conjunctions.forEach((conjunctionString, i) => responsesKeyHash[conjunctionString] = responsesKeys[i]);
    return responses[responsesKeyHash[conjunction]];
  }

  function getResponse(conjunction) {
    console.log(`${conjunction}: `, getResponsesForConjunction(conjunction))
    return null
  }

  function getRevisionCopyForConjunction(conjunction) {
    const count = getResponsesForConjunction(conjunction).length;
    // first submission was optimal so 0 revisions
    if(count === 1) {
      return '0 revisions'
    }
    if(count === 2) {
      return '1 revision';
    }
    return `${count} revisions`
  }

  function getRevisionCopy() {
    let count = 0;
    const noRevisionsCopy = 'You completed the activity with 0 revisions!';
    if(!responses) { return noRevisionsCopy }
    Object.keys(responses).map(key => {
      count += responses[key].length;
    });
    if(count <= 3) { return noRevisionsCopy }
    // we subtract 3 to account for a student having 3 optimal first attempts
    const calculatedCount = count - 3;
    if(calculatedCount === 1) {
      return 'You completed the activity with 1 revision!';
    }
    return `You completed the activity with ${calculatedCount} revisions!`;
  }

  function renderResponseAndExamplarsSection(conjunction: string) {
    return(
      <section className="response-exemplars-section">
        <section className="response-section">
          <div className="response-exemplar-header">
            <p className="sub-header-text">You wrote</p>
            <p className="revision-count">{getRevisionCopyForConjunction(conjunction)}</p>
          </div>
          <section className="response-box">{getResponse(conjunction)}</section>
        </section>
        <section className="exemplars-section">
          <div className="response-exemplar-header">
            <p className="sub-header-text">Example Responses</p>
          </div>
          <section className="exemplar-box">{getStrongExemplar(conjunction, FIRST_STRONG_EXAMPLE)}</section>
          <section className="exemplar-box">{getStrongExemplar(conjunction, SECOND_STRONG_EXAMPLE)}</section>
        </section>
      </section>
    );
  }

  return(
    <div className="post-activity-slide-container">
      <section id="information-section">
        <p id="revision-text">{getRevisionCopy()}</p>
        <p className="slide-sub-text" id="second-sub-text">Revising is a sign of being a thoughtful writer. Be proud of the work you did today, and celebrate your success!</p>
        {/* <img alt="An illustration of a party popper" id="celebration-vector" src={`${process.env.CDN_URL}/images/comprehension/celebrating-activity-completion.svg`} /> */}
        <section id="reminder-badge-section">
          <img alt="An illustration of an A+ that is crossed out" id="grade-badge" src={`${process.env.CDN_URL}/images/comprehension/no-grade-badge.svg`} />
          <section id="reminder-text-section">
            <p className="sub-header-text">Reminder about grades</p>
            <p className="sub-header-subtext">Your teacher will see all of your revisions, but this activity was for practice, so it isn’t graded.</p>
          </section>
        </section>
      </section>
      <section className="responses-exemplars-container">
        <section className="review-response-header-section">
          <p className="sub-header-text">Review the other responses.</p>
          <p className="sub-header-subtext">How is your response similar or different from these responses?</p>
        </section>
        {renderResponseAndExamplarsSection(BECAUSE)}
        {renderResponseAndExamplarsSection(BUT)}
        {renderResponseAndExamplarsSection(SO)}
      </section>
      <section id="button-container">
        <button className="quill-button large secondary outlined focus-on-dark" onClick={handleClick} type="button">Next</button>
      </section>
    </div>
  );
}

export default PostActivitySlide;
