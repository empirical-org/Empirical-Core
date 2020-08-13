import React from 'react';
import { shallow } from 'enzyme';
import { Cues } from '../cues.tsx';
import { Cue, CueExplanation } from 'quill-component-library/dist/componentLibrary';

let mockProps = {
    customText: 'test text',
    diagnosticID: 'ell',
    displayArrowAndText: true,
    question: {
        cues: ['and', 'but', 'or'],
        cuesLabel: 'choose one'
    },
    language: 'english',
    translate: jest.fn()
};

describe('Cues Component', () => {
  let component = shallow(<Cues {...mockProps} />)
  it('renders a Cue component for each cue', () => {
    expect(component.find(Cue)).toHaveLength(3);
  });
  it('getJoiningWordsText renders joing words text based on props', () => {
    const text = component.instance().getJoiningWordsText();
    expect(text).toEqual(mockProps.question.cuesLabel);
  });
  it('translateCueLabel calls translate() function prop', () => {
    const text = `cues^${mockProps.question.cuesLabel}`;
    component.instance().translateCueLabel(mockProps.question, mockProps.translate);
    expect(mockProps.translate).toHaveBeenCalledWith(text);
  });
  it('handleCustomText returns customText if diagnosticID is ell, otherwise calls this.translateCueLabel', () => {
    const text = component.instance().handleCustomText();
    expect(text).toEqual(mockProps.customText);
    mockProps.diagnosticID = 'not-ell';
    component = shallow(<Cues {...mockProps} />)
    const request = component.instance().handleCustomText();
    const response = component.instance().translateCueLabel(mockProps.question, mockProps.translate);
    expect(request).toEqual(response)
  });
  it('renderExplanation returns a CueExplanation component', () => {
    const explanation = component.instance().renderExplanation();
    expect(explanation).toEqual(<CueExplanation />)
  });
});