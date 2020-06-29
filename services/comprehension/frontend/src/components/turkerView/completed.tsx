import * as React from "react";

export const TurkCompleted = () => {
  return(
    <div className="turk-completed-container">
      <h1>Activity Completed!</h1>
      <p>Thank you for completing this activity.</p>
      <p>Your responses will be used to develop our system so that millions of students around the world can improve their reading and writing skills.</p>
      <h1>Payment Directions</h1>
      <p>Use the following HIT code for payment:</p>
      <div className="code">{Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}</div>
    </div>
  );
}

export default TurkCompleted;
