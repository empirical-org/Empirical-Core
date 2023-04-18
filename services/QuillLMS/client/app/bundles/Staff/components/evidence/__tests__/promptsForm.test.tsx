import { shallow } from 'enzyme';
import * as React from 'react';

import { BECAUSE, BUT, FIRST_STRONG_EXAMPLE, SECOND_STRONG_EXAMPLE, SO, TEXT } from '../../../../../constants/evidence';
import PromptsForm from '../configureSettings/promptsForm';

const FEEDBACK = 'At no point in your rambling, incoherent response were you even close to anything that could be considered a rational thought. I award you no points, and may God have mercy on your soul.'

const mockProps = {
  activityBecausePrompt: {
    conjunction: BECAUSE,
    text: '1',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK
  },
  activityButPrompt: {
    conjunction: BUT,
    text: '2',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK
  },
  activitySoPrompt: {
    conjunction: SO,
    text: '3',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK
  },
  errors: {},
  handleSetPrompt: jest.fn()
};

describe('PromptsForm component', () => {
  const container = shallow(<PromptsForm {...mockProps} />);

  it('should render PromptsForm', () => {
    expect(container).toMatchSnapshot();
  });
  it('should call handleSetPrompt when user types in input fields for because prompt properties', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(0).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BECAUSE, TEXT);
    container.find('Input').get(1).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BECAUSE, FIRST_STRONG_EXAMPLE);
    container.find('Input').get(2).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BECAUSE, SECOND_STRONG_EXAMPLE);
  });
  it('should call handleSetPrompt when user types in input fields for but prompt properties', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(3).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BUT, TEXT);
    container.find('Input').get(4).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BUT, FIRST_STRONG_EXAMPLE);
    container.find('Input').get(5).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, BUT, SECOND_STRONG_EXAMPLE);
  });
  it('should call handleSetPrompt when user types in input fields for so prompt properties', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(6).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, SO, TEXT);
    container.find('Input').get(7).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, SO, FIRST_STRONG_EXAMPLE);
    container.find('Input').get(8).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e.target.value, SO, SECOND_STRONG_EXAMPLE);
  });
});
