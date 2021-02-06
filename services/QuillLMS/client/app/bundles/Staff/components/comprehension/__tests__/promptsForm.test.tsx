import * as React from 'react';
import { shallow } from 'enzyme';

import PromptsForm from '../configureSettings/promptsForm';
import { BUT, BECAUSE, SO, FIRST, SECOND }  from '../../../../../constants/comprehension';

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
  it('should call handleSetPrompt when user types in input fields for because, but and so stems', () => {
    const e = { target: { value: 'test change' } };
    container.find('Input').get(0).props.handleChange(e)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, BECAUSE);
    container.find('Input').get(1).props.handleChange(e, BUT)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, BUT);
    container.find('Input').get(2).props.handleChange(e, SO)
    expect(mockProps.handleSetPrompt).toHaveBeenLastCalledWith(e, SO);
  });
});
