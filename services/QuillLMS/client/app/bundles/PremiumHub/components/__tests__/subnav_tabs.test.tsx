import * as React from "react";
import { MemoryRouter } from 'react-router';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import { AdminSubnav } from '../subnav_tabs'

const mockPath = {
  path: {
    pathname: ''
  }
};

// Common setup function
const setup = async (openMenu = false) => {
  render(<MemoryRouter><AdminSubnav path={mockPath} /></MemoryRouter>);
  if (openMenu) {
    const button = screen.getByText('Premium Reports');
    userEvent.click(button);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
  }
}

describe('AdminSubnav', () => {
  test('it should render', () => {
    const { asFragment } = render(<MemoryRouter><AdminSubnav path={mockPath} /></MemoryRouter>);
    expect(asFragment()).toMatchSnapshot();
  });

  test('clicking on premium-reports-button opens the menu', async () => {
    await setup();
    const button = screen.getByText('Premium Reports');
    userEvent.click(button);
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
  });

  test('clicking outside premium-reports-button closes the menu', async () => {
    await setup(true);
    userEvent.click(document.body);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  test('pressing Escape key closes the menu', async () => {
    await setup(true);
    userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

});
