import * as React from 'react';
import { shallow } from 'enzyme';

import PromptsForm from '../configureSettings/promptsForm';
import { Input, TextEditor } from '../../../../Shared/index';
import { BUT, BECAUSE, SO, FIRST, SECOND }  from '../../../../../constants/comprehension';

const FEEDBACK = 'At no point in your rambling, incoherent response were you even close to anything that could be considered a rational thought. I award you no points, and may God have mercy on your soul.'

const mockProps = {
  activityBecausePrompt: {
    conjunction: BECAUSE,
    text: '1',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK,
    plagiarism_text: BECAUSE,
    plagiarism_first_feedback: FEEDBACK,
    plagiarism_second_feedback: FEEDBACK
  },
  activityButPrompt: {
    conjunction: BUT,
    text: '2',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK,
    plagiarism_text: BUT,
    plagiarism_first_feedback: FEEDBACK,
    plagiarism_second_feedback: FEEDBACK
  },
  activitySoPrompt: {
    conjunction: SO,
    text: '3',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK,
    plagiarism_text: SO,
    plagiarism_first_feedback: FEEDBACK,
    plagiarism_second_feedback: FEEDBACK
  },
  errors: {},
  handleSetPlagiarismFeedback: jest.fn(),
  handleSetPlagiarismText: jest.fn(),
  handleSetPrompt: jest.fn()
};

describe('PromptsForm component', () => {
  const container = shallow(<PromptsForm {...mockProps} />);

  it('should render PromptsForm', () => {
    expect(container).toMatchSnapshot();
  });
  it('should call handleSetPrompt when user types in input fields for because, but and so stems', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(0).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, BECAUSE);
    container.find('Input').get(3).props.handleChange(e, BUT)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, BUT);
    container.find('Input').get(6).props.handleChange(e, SO)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, SO);
  });
  it('should call handleSetPlagiarismText when user types in input fields for because, but and so plagiarism text', () => {
    const e = { target: { value: 'test change' } };
    container.find('TextEditor').get(0).props.handleTextChange(e)
    expect(mockProps.handleSetPlagiarismText).toHaveBeenLastCalledWith(e, BECAUSE);
    container.find('TextEditor').get(1).props.handleTextChange(e, BUT)
    expect(mockProps.handleSetPlagiarismText).toHaveBeenLastCalledWith(e, BUT);
    container.find('TextEditor').get(2).props.handleTextChange(e, SO)
    expect(mockProps.handleSetPlagiarismText).toHaveBeenLastCalledWith(e, SO);
  });
  it('should call handleSetPlagiarismFeedback when user types in input fields for because, but and so plagiarism feedback', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(1).props.handleChange(e)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, FIRST, BECAUSE);
    container.find('Input').get(2).props.handleChange(e, BUT)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, SECOND, BECAUSE);
    container.find('Input').get(4).props.handleChange(e)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, FIRST, BUT);
    container.find('Input').get(5).props.handleChange(e, BUT)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, SECOND, BUT);
    container.find('Input').get(7).props.handleChange(e)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, FIRST, SO);
    container.find('Input').get(8).props.handleChange(e, BUT)
    expect(mockProps.handleSetPlagiarismFeedback).toHaveBeenLastCalledWith(e, SECOND, SO);
  });
});
