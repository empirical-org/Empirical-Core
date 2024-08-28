import * as React from 'react';
import { render, screen } from '@testing-library/react';

import QuillResourceLink from '../quill_resource_link';


describe('QuillResourceLink', () => {
  test('renders an anchor tag with the correct href when the href prop is provided', () => {
    const text = 'Test Link';
    const href = 'https://example.com';

    render(<QuillResourceLink href={href} text={text} />);

    const linkElement = screen.getByRole('link', { name: text });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', href);
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  test('renders a disabled button with ComingSoonTooltip when the href prop is not provided', () => {
    const text = 'Test Button';

    render(<QuillResourceLink text={text} />);

    const buttonElement = screen.getByText(text).closest('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });
});
