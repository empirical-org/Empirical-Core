import * as React from "react";
import { render, screen, } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import { FULL, LIMITED, RESTRICTED } from "../../shared";
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
  accessType: RESTRICTED,
  location: {
    pathname: "/teachers/premium_hub/usage_snapshot_report"
  }
}

describe('PremiumFilterableReportsContainer', () => {
  describe('restricted access', () => {
    test('it should render the RestrictedPage', () => {
      render(<PremiumFilterableReportsContainer {...props} />)
      const lockImg = screen.getByRole('img', { name: /gray lock/i })
      console.log('lockImg', lockImg)
    })
  })
})
