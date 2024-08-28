import * as React from "react";
import { render, } from "@testing-library/react";

import QuillResourceLink from '../quill_resource_link'

describe('QuillResourceLink', () => {
  test('it should render if there is an href prop', () => {
    const { asFragment } = render(<QuillResourceLink href="/" text="Click me" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('it should render if there is not an href prop', () => {
    const { asFragment } = render(<QuillResourceLink href="/" text="Do not click me" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
