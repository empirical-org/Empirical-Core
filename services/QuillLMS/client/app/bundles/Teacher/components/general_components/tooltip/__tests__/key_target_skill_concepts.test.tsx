import * as React from 'react';
import { render, screen } from "@testing-library/react";

import KeyTargetSkillConcepts from '../key_target_skill_concepts';

const groupedKeyTargetSkillConcepts = [
  {
    name: 'Conventions of Language',
    correct: 1,
    incorrect: 7,
  },
  {
    name: 'Subordinating Conjunctions',
    correct: 0,
    incorrect: 3
  }
]

describe('KeyTargetSkillConcepts component', () => {
  it('should render', () => {
    const { asFragment } = render(<KeyTargetSkillConcepts groupedKeyTargetSkillConcepts={groupedKeyTargetSkillConcepts} />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(/conventions of language/i)).toBeInTheDocument()
    expect(screen.getByText(/subordinating conjunctions/i)).toBeInTheDocument()
  })
});
