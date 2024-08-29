import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ContentHubCard, { WORLD_HISTORY, AI_KNOWLEDGE } from '../content_hub_card';

test('renders World History Activities card', () => {
  const { asFragment } = render(<ContentHubCard contentHub={WORLD_HISTORY} />);

  expect(screen.getByText('World History Activities')).toBeInTheDocument();

  expect(screen.getByText('Who is it for?')).toBeInTheDocument();
  expect(screen.getByText(/High school world history and ELA teachers/i)).toBeInTheDocument();
  expect(screen.getByText('Pair with OER Project for deeper learning')).toBeInTheDocument();
  expect(screen.getByText(/free paired activity from OER Project/i)).toBeInTheDocument();

  expect(screen.getByAltText('Quill logo plus OER Project logo')).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

test('renders AI Knowledge Activities card', () => {
  const { asFragment } = render(<ContentHubCard contentHub={AI_KNOWLEDGE} />);

  expect(screen.getByText('AI Knowledge Activities')).toBeInTheDocument();

  expect(screen.getByText('Who is it for?')).toBeInTheDocument();
  expect(screen.getByText(/8-12 Computer Science, ELA, or General Education teachers/i)).toBeInTheDocument();
  expect(screen.getByText('Pair with aiEDU for deeper learning')).toBeInTheDocument();
  expect(screen.getByText(/free paired activity from our partner nonprofit aiEDU/i)).toBeInTheDocument();

  expect(screen.getByAltText('Quill logo plus aiEDU: The AI Education Project logo')).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});
