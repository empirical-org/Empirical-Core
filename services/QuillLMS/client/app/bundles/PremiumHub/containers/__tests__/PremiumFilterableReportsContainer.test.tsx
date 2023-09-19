import * as React from "react";
import { render } from "@testing-library/react";

import { FULL } from "../../shared";
import PremiumFilterableReportsContainer from "../PremiumFilterableReportsContainer";

const props = {
  adminInfo: {
    admin_approval_status: null,
    admin_sub_role: null,
    administers_school_with_premium: true,
    associated_school: {},
    associated_school_has_premium: true,
    email: "test-user@email.com",
    id: 12345,
    name: "Test User",
    role: "admin"
  },
  accessType: FULL,
  location: {
    pathname: "/teachers/premium_hub/usage_snapshot_report"
  }
}

describe('PremiumFilterableReportsContainer', () => {
  test('it should render', () => {
    const { asFragment } = render(<PremiumFilterableReportsContainer {...props} />);
    expect(asFragment()).toMatchSnapshot();
  })
})
