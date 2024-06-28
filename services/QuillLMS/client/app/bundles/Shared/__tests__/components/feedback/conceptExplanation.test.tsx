import * as React from "react";
import { render } from "@testing-library/react";

import { ConceptExplanation } from "../../../components/feedback/conceptExplanation";

const props = {
  description: "Combine two describing words using and.",
  leftBox: "The sun was bright. The sun was warm.",
  rightBox: "The sun was bright and warm.",
  translatedDescription: "Combinar dos palabras usando and.",
  adminShowTranslation: true
}

describe('ConceptExplanation', () => {
  test('it should render', () => {
    const { asFragment } = render(<ConceptExplanation {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
