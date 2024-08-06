import { render } from "@testing-library/react";
import * as React from "react";

import { Register } from "../../components/studentLessons/register";

const props = {
  language: 'english',
  lesson: {
    flag: "production",
    landingPageHtml: "Joining sentences",
    modelConceptUID: "GiUZ6KPkH958AT8S413nJg",
    name: "And - Deserts",
    questionType: "questions",
    questions: [],
  },
  previewMode: true,
  resumeActivity: () => {},
  startActivity:  () => {}
}

describe('Register', () => {
  test('it should render without translations', () => {
    const { asFragment } = render(<Register {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

  // Note--once we take out the feature flag, this will show the translations and we'll have to redo the snapshot
  test('it should render with translations', () => {
    props.lesson['translations'] = {"spanish" : "Conjunto oraciones"}
    props.language = 'spanish'
    const { asFragment } = render(<Register {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })

})
