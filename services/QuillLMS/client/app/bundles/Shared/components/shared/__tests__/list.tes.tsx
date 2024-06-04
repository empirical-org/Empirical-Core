import * as React from "react";
import { render, screen } from "@testing-library/react";

import List from "../list";

const mockProps1 = {
  items: [{label: 'List Item 1', onClick: jest.fn}, {label: 'List Item 2', onClick: jest.fn}, {label: 'List Item 3', onClick: jest.fn}],
  style: 'primary'
}

const mockProps2 = {
  items: [{ primaryText: 'Title 1', secondaryText: 'Text 1', onClick: jest.fn }, { primaryText: 'Title 2', secondaryText: 'Text 2', onClick: jest.fn }],
  style: 'secondary'
}

const mockProps3 = {
  items: [{ label: 'checkbox 1', selected: false }, { label: 'checkbox 2', selected: false }],
  style: 'checkbox'
}

const mockProps4 = {
  items: [{ label: 'List Item 1' }, { label: 'List Item 2' }, { label: 'List Item 3' }],
  style: 'primary'
}

describe('List', () => {
  test('it should render primary style as expected', () => {
    const { asFragment } = render(<List {...mockProps1} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/list item 1/i)).toBeTruthy()
    expect(screen.getByText(/list item 2/i)).toBeTruthy()
    expect(screen.getByText(/list item 3/i)).toBeTruthy()
    expect(screen.getAllByRole('button')).toHaveLength(mockProps1.items.length)
  })
  test('it should render secondary style as expected', () => {
    const { asFragment } = render(<List {...mockProps2} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/title 1/i)).toBeTruthy()
    expect(screen.getByText(/text 1/i)).toBeTruthy()
    expect(screen.getByText(/title 2/i)).toBeTruthy()
    expect(screen.getByText(/text 2/i)).toBeTruthy()
    expect(screen.getAllByRole('button')).toHaveLength(mockProps2.items.length)
  })
  test('it should render checkbox style as expected', () => {
    const { asFragment } = render(<List {...mockProps3} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/checkbox 1/i)).toBeTruthy()
    expect(screen.getByText(/checkbox 2/i)).toBeTruthy()
  })
  test('it should render primary style without buttons as expected', () => {
    const { asFragment } = render(<List {...mockProps4} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/list item 1/i)).toBeTruthy()
    expect(screen.getByText(/list item 2/i)).toBeTruthy()
    expect(screen.getByText(/list item 3/i)).toBeTruthy()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
