import * as React from "react";
import { render, screen } from "@testing-library/react";

import { Register } from "../register";

const mockProps = {
  lesson: {
    questions: [],
    questionType: '',
    landingPageHtml: null
  },
  startActivity: jest.fn(),
  resumeActivity: jest.fn(),
  session: {},
  translate: jest.fn(),
  showTranslation: false
}

describe('Register', () => {
  test('it should render default Connect intro', () => {
    const { asFragment } = render(<Register {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
    const heading = screen.getByRole('heading', {
      name: /welcome to quill connect!/i
    });
    expect(heading).toBeInTheDocument()
  })
  test('it should render lesson specific intro', () => {
    mockProps.lesson.questionType = 'fillInBlank'
    mockProps.lesson.landingPageHtml = 'test landing page'
    const { asFragment } = render(<Register {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
    const landingPageText = screen.getByText(/test landing page/i);
    expect(landingPageText).toBeInTheDocument()
  })
})
