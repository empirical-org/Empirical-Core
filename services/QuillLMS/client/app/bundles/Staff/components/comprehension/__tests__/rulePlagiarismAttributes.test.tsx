import * as React from 'react';
import { shallow } from 'enzyme';

import RulePlagiarismAttributes from '../configureRules/rulePlagiarismAttributes';
import { TextEditor } from '../../../../Shared/index'

const mockProps = {
  errors: {},
  firstPlagiarismFeedback: { text: 'do not plagiarize.' },
  plagiarismText: 'test plagiarism text',
  secondPlagiarismFeedback: { text: 'seriously... do not plagiarize!' },
  setFirstPlagiarismFeedback: jest.fn(),
  setPlagiarismText: jest.fn(),
  setSecondPlagiarismFeedback: jest.fn()
};

describe('RulePlagiarismAttributes component', () => {
  let container = shallow(<RulePlagiarismAttributes {...mockProps} />);

  it('should render RulePlagiarismAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components', () => {
    // TextEditor: Plagiarism Text, First Plagiarism Feedback, Second Plagiarism Feedback (3)
    expect(container.find(TextEditor).length).toEqual(3);
  });
});
