import * as React from 'react';
import { shallow } from 'enzyme';

import SemanticRulesCheatSheet from '../semanticRules/semanticRulesCheatSheet';
import { BUT, BECAUSE, SO }  from '../../../../../constants/comprehension';

const FEEDBACK = 'At no point in your rambling, incoherent response were you even close to anything that could be considered a rational thought. I award you no points, and may God have mercy on your soul.'

const mockRules = [
  { id: 1, name: 'rule_1', feedbacks: [{ text: "Here is some feedback" }], note: "Here is a note" },
  { id: 2, name: 'rule_2', feedbacks: [{ text: "Here is some other feedback" }], note: "Here is another note" },
]

const mockActivity = {
  title: 'Could Capybaras Create Chaos?',
  prompts: [
    {
      conjunction: BECAUSE,
      text: '1',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK,
      id: 1,
    },
    {
      conjunction: BUT,
      text: '2',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK,
      id: 2,
    },
    {
      conjunction: SO,
      text: '3',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK,
      id: 3,
    }
  ]
}

jest.mock("react-query", () => ({
  useQuery: jest.fn(() => ({
    data: {
      rules: mockRules,
      activity: mockActivity
    },
    error: null,
    status: "success",
    isFetching: true,
  })),
}));

describe('SemanticRulesCheatSheet component', () => {
  const mockProps = {
    match: {
      params: {
        activityId: "1",
        promptId: "1"
      }
    }
  }

  const container = shallow(
    <SemanticRulesCheatSheet {...mockProps} />
  );

  it('should render SemanticRulesCheatSheet', () => {
    expect(container).toMatchSnapshot();
  });
});
