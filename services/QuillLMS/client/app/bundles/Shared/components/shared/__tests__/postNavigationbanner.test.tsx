import * as React from "react";
import { render, screen } from "@testing-library/react";

import PostNavigationBanner from "../postNavigationBanner";

const mockProps = {
  tagText: 'new',
  primaryHeaderText: 'Test header text',
  bodyText: 'Test body text.',
  icon: {
    alt: '',
    src: ''
  },
  buttons: [
    {
      href: "www.test1.com",
      text: "Learn more",
      target: "_blank"
    },
    {
      text: "View activities",
      onClick: jest.fn()
    },
    {
      href: "www.test2.com",
      text: "See tool demo",
      className: "small outlined",
      target: "_blank"
    },
    {
      href: "www.test3.com",
      text: "Get the Teacher Handbook",
      className: "small outlined",
      target: "_blank"
    }
  ],
  bannerStyle: 'green'
}

describe('PostNavigationBanner', () => {
  test('it should render', () => {
    const { asFragment } = render(<PostNavigationBanner {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  })
  it('should render the buttons as expected', () => {
    const { asFragment } = render(<PostNavigationBanner {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', 'www.test1.com')
    expect(screen.getByRole('button', { name: 'View activities' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See tool demo' })).toHaveAttribute('href', 'www.test2.com')
    expect(screen.getByRole('link', { name: 'Get the Teacher Handbook' })).toHaveAttribute('href', 'www.test3.com')
  })
})
