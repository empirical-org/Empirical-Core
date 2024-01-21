import * as React from "react";
import { render, } from "@testing-library/react";

import AdminActionModal from '../admin_action_modal'

const props = {
  handleClickConfirm: jest.fn(),
  handleCloseModal: jest.fn(),
  headerText: 'Header',
  bodyText: 'body'
}

describe('AdminActionModal', () => {
  test('it should render', () => {
    const { asFragment } = render(<AdminActionModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
