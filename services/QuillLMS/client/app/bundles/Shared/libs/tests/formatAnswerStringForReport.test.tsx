import * as React from 'react';
import { render } from '@testing-library/react';
import { diffWords } from 'diff';

import { formatAnswerStringForReport } from '../formatAnswerStringForReport'

// Mocking the diff function since it's from an external library
jest.mock('diff', () => ({
  diffWords: jest.fn(),
}));

describe('formatAnswerStringForReport', () => {
  it('returns the answer as is if no previous answer and showDiff is false', () => {
    const answer = 'This is a test';
    const result = formatAnswerStringForReport(answer, null, 0, false);
    expect(result).toBe(answer);
  });

  it('returns the answer with no formatting if showDiff is false', () => {
    const answer = 'This is a test';
    const previousAnswer = 'This was a test';
    const result = formatAnswerStringForReport(answer, previousAnswer, 0, false);
    expect(result).toBe(answer);
  });

  it('formats the answer with differences highlighted if showDiff is true', () => {
    const answer = 'This is a test';
    const previousAnswer = 'This was a test';
    diffWords.mockReturnValue([
      { value: 'This ', added: false, removed: false },
      { value: 'was', added: false, removed: true },
      { value: 'is', added: true, removed: false },
      { value: ' a test', added: false, removed: false }
    ]);

    const { container } = render(formatAnswerStringForReport(answer, previousAnswer, 0, true));
    expect(container.innerHTML).toContain('<b>is</b>');
    expect(container.innerHTML).toContain('<span>This </span>');
    expect(container.innerHTML).toContain('<span> a test</span>');
  });

  it('handles empty strings correctly', () => {
    const answer = '';
    const previousAnswer = '';
    diffWords.mockReturnValue([]);
    const { container } = render(formatAnswerStringForReport(answer, previousAnswer, 0, true));
    expect(container.innerHTML).toContain('');
  });
});
