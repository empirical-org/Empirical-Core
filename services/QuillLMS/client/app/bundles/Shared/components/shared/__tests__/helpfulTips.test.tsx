import * as React from "react";
import { render } from "@testing-library/react";

import { HelpfulTips, } from "../helpfulTips";

const props = {
  header: <h3>Helpful Tips <span>(Expand to show more information)</span></h3>,
  sections: [
    {
      headerText: "You will receive full credit on each question where you reach a strong response by the final attempt.",
      body: (
        <React.Fragment>
          <p>Questions where you reached a strong response by your final attempt will be indicated in green.</p><br />
          <p>Questions where you didn’t reach a strong response by your final attempt will be indicated in yellow.</p><br />
          <p>Your score is calculated by how many strong responses you got out of the total number of questions:</p>
          <ul>
            <li>Green for scoring between 83-100%</li>
            <li>Yellow for scoring between 32%-82%</li>
            <li>Red for scoring between 0-31%</li>
          </ul><br />
          <p>We encourage you to replay activities to get additional practice on skills and <a href="https://www.quill.org/teacher-center/go-for-green" rel="noopener noreferrer" target="_blank">Go for Green.</a></p>
        </React.Fragment>
      )
    },
    {
      headerText: "The bolded text helps you see edits you made to your writing.",
      body: (
        <React.Fragment>
          <p>In each of your responses, we have bolded all of the text that was added or edited from your previous response so that you can quickly see what you changed as you worked through the activity.</p><br />
          <p>This is different from the bolding you see within an activity, which provides hints on what to improve. In the feedback you see below, phrases like “look at the bolded word” refer to the bolding you got as a hint within the activity, not the bolded text you see on this report.</p>
        </React.Fragment>
      )
    },
    {
      headerText: 'This one is disabled',
      isDisabled: true
    }
  ]
}

describe('HelpfulTips', () => {
  test('it should render', () => {
    const { asFragment } = render(<HelpfulTips {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
