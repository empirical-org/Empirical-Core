import * as React from "react";
import { render, waitFor } from "@testing-library/react";

import { defaultFilterData, } from './data'

import { FULL } from "../../shared";
import PremiumFilterableReportsContainer from "../PremiumFilterableReportsContainer";
import * as requestsApi from '../../../../modules/request';

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Mock requestPost to resolve with the defaultFilterData
  jest.spyOn(requestsApi, 'requestPost').mockImplementation((url, params, callback) => {
    callback(defaultFilterData);
  });

  test('it should render', async () => {
    const { asFragment, queryByAltText, } = render(<PremiumFilterableReportsContainer {...props} />);

    // Wait for the spinner (identified by its alt text) to be removed
    await waitFor(() => expect(queryByAltText('Loading spinner')).toBeNull());

    // Take the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
})
