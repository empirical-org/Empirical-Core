import * as React from "react";
import { render, } from "@testing-library/react";

import CreateAndLinkAccountsModal from '../create_and_link_accounts_modal'

const props = {
  addTeacherAccount: jest.fn(),
  handleCloseModal: jest.fn(),
  schoolOptions: [
    {label: "Douglass High School", value: 1},
    {label: "MLK Middle School", value: 2},
  ]
}

describe('CreateAndLinkAccountsModal', () => {
  test('it should render', () => {
    const { asFragment } = render(<CreateAndLinkAccountsModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
