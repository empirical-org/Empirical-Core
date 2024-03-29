import { splitPromptForFillInBlank } from '../splitPromptForFillInBlank'

describe('splitPromptForFillInBlank', () => {
  test('splits prompt with no HTML tags correctly', () => {
    const prompt = 'This is a test___and this is another part.';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This is a test', 'and this is another part.']);
  });

  test('replaces in-prompt closing and opening <p> tags with <br/>s and splits correctly', () => {
    const prompt = 'Question: Do you like lemonade? <p>Answer: ___.</p><p>Answer: ___.</p>';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['Question: Do you like lemonade? <br/>Answer: ', '.</br>Answer: ', '.']);
  });

  test('replaces </p><p> with </br> and splits correctly', () => {
    const prompt = 'This has</p><p>paragraph tags___and should split.';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This has</br>paragraph tags', 'and should split.']);
  });

  test('removes around-prompt <p> tags, replaces in-prompt </p><p> with </br>, and splits correctly', () => {
    const prompt = '<p>This has</p><p>paragraph tags___and should split.</p>';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This has</br>paragraph tags', 'and should split.']);
  });

  test('replaces <p> with <br/> in the middle of the string and splits correctly', () => {
    const prompt = 'This has a<p>paragraph tag in the middle___and splits.';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This has a<br/>paragraph tag in the middle', 'and splits.']);
  });

  test('removes all </p> tags and splits correctly', () => {
    const prompt = 'This has a closing</p> tag___and then splits.';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This has a closing tag', 'and then splits.']);
  });

  test('handles strings without the delimiter', () => {
    const prompt = 'This has no delimiter but has <p>tags</p>.';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['This has no delimiter but has <br/>tags.']);
  });

  test('handles empty strings correctly', () => {
    const prompt = '';
    const result = splitPromptForFillInBlank(prompt);
    expect(result).toEqual(['']);
  });
});
