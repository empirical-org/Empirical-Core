import * as React from "react";
import { render, } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

import AccountManagementSection from '../accountManagementSection'

const props = {
  handleClickLogInAsATeacher: jest.fn(),
}

describe('AccountManagementSection', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><AccountManagementSection {...props} /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  });
});
