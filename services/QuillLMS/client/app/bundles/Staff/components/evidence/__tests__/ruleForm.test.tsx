import * as React from 'react';
import { shallow } from 'enzyme';
import { QueryClient, QueryClientProvider } from 'react-query'

import { mockRule } from '../__mocks__/data';
import RuleForm from '../configureRules/ruleForm';

jest.mock('../../../helpers/evidence/ruleHelpers', () => ({
  // ...jest.requireActual('../../../helpers/evidence/ruleHelpers'),
  handleSetRuleNote: jest.fn().mockImplementation((text: string, setRuleNote) => { setRuleNote(text) }),
  handleSetFeedback: jest.fn().mockImplementation(() => {}),
  getInitialRuleType: jest.fn().mockImplementation(() => {
    return { value: 'rules-based-1', label: 'Sentence Structure Regex' }
  }),
  formatInitialFeedbacks: jest.fn().mockImplementation(() => {
    return [{
      id: 7,
      description: null,
      order: 0,
      text: 'Revise your work. Delete the phrase "it contains methane" because it repeats the first part of the sentence',
      highlights_attributes: []
    }];
  }),
  renderHighlights: jest.fn().mockImplementation(() => {
    return []
  }),
  formatRegexRules: jest.fn().mockImplementation(({ rule, setRegexRules }) => {
    let formatted = {};
    setRegexRules(formatted);
  })
}));
jest.mock('../../../helpers/evidence/renderHelpers', () => ({
  renderErrorsContainer: jest.fn().mockImplementation(() => {
    return <strong>error!</strong>
  }),
  renderIDorUID: (idOrRuleId: string | number, type: string) => {
    return(
      <section className="label-status-container">
        <p id="label-status-label">{type}</p>
        <p id="label-status">{idOrRuleId}</p>
      </section>
    );
  }
}));

const queryClient = new QueryClient()

const mockProps = {
  rule: mockRule,
  activityData: {
    name: 'test',
    title: 'test',
    scored_level: '7',
    target_level: 7
  },
  activityId : '1',
  closeModal: jest.fn(),
  requestErrors: [],
  submitRule: jest.fn(),
  isUniversal: false
};

describe('RuleForm component', () => {
  let container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RuleForm {...mockProps} />
    </QueryClientProvider>
  );

  it('should render RuleForm', () => {
    expect(container).toMatchSnapshot();
  });
});
