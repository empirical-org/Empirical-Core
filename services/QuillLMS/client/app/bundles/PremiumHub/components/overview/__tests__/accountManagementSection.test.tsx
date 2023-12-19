import * as React from "react";
import { render, } from "@testing-library/react";

import AccountManagementSection from '../accountManagementSection'

const props = {
  handleClickLogInAsATeacher: jest.fn(),
}

describe('AccountManagementSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<AccountManagementSection {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
