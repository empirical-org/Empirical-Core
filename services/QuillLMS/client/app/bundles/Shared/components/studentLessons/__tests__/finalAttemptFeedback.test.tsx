import * as React from "react";
import { render } from "@testing-library/react";

import { FinalAttemptFeedback } from "../finalAttemptFeedback";

const props = {
  latestAttempt: "This is my latest wrong response.",
  correctResponse: "This is the correct response."
}

describe('FinalAttemptFeedback', () => {
  test('it should render', () => {
    const { asFragment } = render(<FinalAttemptFeedback {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
