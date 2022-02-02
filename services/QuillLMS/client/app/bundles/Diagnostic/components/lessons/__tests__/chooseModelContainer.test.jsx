import React from 'react';
import { shallow } from 'enzyme';
import { ChooseModel } from '../chooseModel.tsx';
import ConceptSelector from '../../shared/conceptSelector.jsx';
import { ConceptExplanation } from '../../../../Shared/index';

describe('ChooseModel component', () => {
  const mockProps = {
    children: [<div key="1" />],
    conceptsFeedback: {
      data: {
        test123: {
          description: 'this is an explanation!',
          leftBox: 'left',
          rightBox: 'right'
        }
      }
    },
    modelConceptUID: 'test123',
    updateModelConcept: jest.fn()
  };
  const component = shallow(<ChooseModel {...mockProps} />);
  it('renders ConceptSelector and ConceptExplanation components, passing expected props', () => {
    const selectConcept = component.instance().selectConcept;
    const conceptSelector = component.find(ConceptSelector);
    const conceptExplanation = component.find(ConceptExplanation);
    expect(conceptSelector.length).toEqual(1);
    expect(conceptExplanation.length).toEqual(1);
    expect(conceptSelector.props().currentConceptUID).toEqual(mockProps.modelConceptUID);
    expect(conceptSelector.props().handleSelectorChange).toEqual(selectConcept);
    expect(conceptExplanation.props()).toEqual(mockProps.conceptsFeedback.data.test123);
  });
  it('handleRemoveModelConcept calls updateModelConcept prop function with null as argument', () => {
    component.instance().handleRemoveModelConcept();
    expect(mockProps.updateModelConcept).toHaveBeenCalledWith(null);
  });
  it('selectConcept calls updateModelConcept prop function with e.value as argument', () => {
    const e = {
      value: 'so spicy'
    }
    component.instance().selectConcept(e);
    expect(mockProps.updateModelConcept).toHaveBeenCalledWith(e.value);
  });
});
