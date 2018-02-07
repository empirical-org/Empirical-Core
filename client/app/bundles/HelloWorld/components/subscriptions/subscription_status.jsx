import React from 'react';
import moment from 'moment';

export default class extends React.Component {

  render() {
    return (
      <section>
        <div className="flex-row space-between">
          <h2>You have a School Premium subscription</h2>
          <span>Valid Until: Novemeber 31st, 2019 (EST)</span>
        </div>
        <p>
          With Quill School Premium, you will have access to all of Quill’s
          free reports as well as additional advanced reporting. You will also
          be able to view and print reports of your students’ progress. Our
          advanced reports support concept, Common Core, and overall progress
          analysis.
          <a>Here’s more information</a>
          about your Teacher Premium features.
        </p>
      </section>
    );
  }
}
