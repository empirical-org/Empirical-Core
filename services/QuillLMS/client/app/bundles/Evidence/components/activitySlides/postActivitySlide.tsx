import * as React from "react";

export const PostActivitySlide = ({ responses, user, handleClick, }) => {

  function getRevisionCopy() {
    let count = 0;
    if(!responses) { return 'You used evidence to write 3 strong sentences!' }
    Object.keys(responses).map(key => {
      count += responses[key].length;
    });
    if(count <= 3) { return 'You used evidence to write 3 strong sentences!' }
    // we subtract 3 to account for a student having 3 optimal first attempts
    const calculatedCount = count - 3;
    if(calculatedCount === 1) {
      return 'You made 1 revision!';
    }
    return `You made ${calculatedCount} revisions!`;
  }

  const completionText = user ? `${user}, you completed the activity!` : 'You completed the activity!'

  return(
    <div className="post-activity-slide-container">
      <section id="information-section">
        <p className="slide-sub-text" id="first-sub-text">{completionText}</p>
        <p id="revision-text">{getRevisionCopy()}</p>
        <img alt="An illustration of a party popper" id="celebration-vector" src={`${process.env.CDN_URL}/images/comprehension/celebrating-activity-completion.svg`} />
        <section id="reminder-badge-section">
          <img alt="An illustration of an A+ that is crossed out" id="grade-badge" src={`${process.env.CDN_URL}/images/comprehension/no-grade-badge.svg`} />
          <section id="reminder-text-section">
            <p id="reminder-header">Reminder about grades</p>
            <p id="reminder-subtext">Your teacher will see all of your revisions, but this activity was for practice, so it isn’t graded.</p>
          </section>
        </section>
        <p className="slide-sub-text" id="second-sub-text">Revising is a sign of being a thoughtful writer. Be proud of the work you did today and celebrate your success!</p>
      </section>
      <section id="button-container">
        <button className="quill-button large secondary outlined focus-on-dark" onClick={handleClick} type="button">Next</button>
      </section>
    </div>
  );
}

export default PostActivitySlide;
