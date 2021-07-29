import * as React from "react";

export const PostActivitySlide = ({ handleFinishActivity }) => {
  function handleClick() {
    handleFinishActivity();
  }
  return(
    <div className="post-activity-slide-container">
      <section id="information-section">
        <p className="slide-sub-text">{`Ja’shonda, you completed the activity!`}</p>
        <p id="revision-text">{`You made 14 revisions!`}</p>
        <img alt="An illustration of a party popper" id="celebration-vector" src={`${process.env.CDN_URL}/images/comprehension/celebrating-activity-completion.svg`} />
        <section id="reminder-badge-section">
          <img alt="An illustration of an A+ that is crossed out" id="grade-badge" src={`${process.env.CDN_URL}/images/comprehension/no-grade-badge.svg`} />
          <section id="reminder-text-section">
            <p id="reminder-header">Reminder about grades</p>
            <p id="reminder-subtext">Your teacher will see all of your revisions, but this activity was for practice, so it isn’t graded.</p>
          </section>
        </section>
        <p className="slide-sub-text">Revising is a sign of being a thoughtful writer. Be proud of the work you did today and celebrate your success!</p>
      </section>
      <section id="button-container">
        <button className="quill-button large secondary outlined" onClick={handleClick} type="submit">Save and exit</button>
      </section>
    </div>
  );
}

export default PostActivitySlide;
