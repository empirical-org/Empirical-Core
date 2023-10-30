import * as React from "react";
import { render, waitFor, screen, } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Route } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

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

  beforeEach(() => {
    jest.spyOn(requestsApi, 'requestPost').mockImplementation((url, params, callback) => {
      callback(defaultFilterData);
    });
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('it should render', async () => {
    const { asFragment, queryByAltText, } = render(<BrowserRouter><CompatRouter><PremiumFilterableReportsContainer {...props} /></CompatRouter></BrowserRouter>);

    await waitFor(() => expect(queryByAltText('Loading spinner')).toBeNull());

    expect(asFragment()).toMatchSnapshot();
  });

  test('it should toggle filter menu visibility when clicking the showFilterMenuButton', async () => {
    const filterMenuTestId = 'filter-menu'

    const { queryByAltText, } = render(<BrowserRouter><CompatRouter><PremiumFilterableReportsContainer {...props} /></CompatRouter></BrowserRouter>);

    await waitFor(() => expect(queryByAltText('Loading spinner')).toBeNull());

    await userEvent.click(screen.getByLabelText('Close filter menu'));

    expect(screen.queryByTestId(filterMenuTestId)).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Open filter menu'));

    expect(screen.getByTestId(filterMenuTestId)).toBeInTheDocument();
  })

})
