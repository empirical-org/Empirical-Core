import * as React from 'react';
import { shallow } from 'enzyme';

import RulePlagiarismAttributes, { PlagiarismTextEditor, } from '../configureRules/rulePlagiarismAttributes';
import { TextEditor } from '../../../../Shared/index'

const mockProps = {
  errors: {},
  plagiarismFeedbacks: [{ text: 'do not plagiarize.' }, { text: 'seriously... do not plagiarize!' }],
  plagiarismTexts: [{ text: 'test plagiarism text', }, { text: 'test another plagiarism text', }],
  setPlagiarismFeedbacks: jest.fn(),
  setPlagiarismTexts: jest.fn()
};

describe('RulePlagiarismAttributes component', () => {
  let container = shallow(<RulePlagiarismAttributes {...mockProps} />);

  it('should render RulePlagiarismAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components', () => {
    // TextEditor: First Plagiarism Feedback, Second Plagiarism Feedback (2)
    // Plagiarism Text Editor: Plagiarism Text - Text String 1, Plagiarism Text - Text String 2 (2)
    expect(container.find(TextEditor).length).toEqual(2);
    expect(container.find(PlagiarismTextEditor).length).toEqual(2);
  });
});
