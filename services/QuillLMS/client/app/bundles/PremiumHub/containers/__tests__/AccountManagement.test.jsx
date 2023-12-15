import * as React from "react";
import { render, } from "@testing-library/react";

import AccountManagement from '../AccountManagement';
import { FULL, RESTRICTED, LIMITED, } from '../../shared'

const sharedProps = {
  passedModel: { teachers: [], schools: [], admin_approval_requests: [] },
  adminId: 7,
}

describe('AccountManagement container', () => {
  test('should render with a full access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={FULL} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render with a limited access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={LIMITED} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render with a restricted access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={RESTRICTED} />);
    expect(asFragment()).toMatchSnapshot();
  })

});
