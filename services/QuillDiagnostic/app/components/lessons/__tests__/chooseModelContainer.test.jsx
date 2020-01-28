import React from 'react';
import { shallow } from 'enzyme';
import { ChooseModel } from '../chooseModel.tsx';
import ConceptSelector from '../../shared/conceptSelector.jsx';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';

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
        onUpdateModelConcept: jest.fn()
    };
    const component = shallow(<ChooseModel {...mockProps} />);
    it('renders ConceptSelector and ConceptExplanation components, passing expected props', () => {
        const selectConcept = component.instance().selectConcept;
        const conceptSelector = component.find(ConceptSelector);
        const conceptExplanation = component.find(ConceptExplanation);
        expect(conceptSelector.length).toEqual(1);
        expect(conceptExplanation.length).toEqual(1);
        expect(conceptSelector.props().currentConceptUID).toEqual('test123');
        expect(conceptSelector.props().handleSelectorChange).toEqual(selectConcept);
        expect(conceptExplanation.props()).toEqual(mockProps.conceptsFeedback.data.test123);
    });
    it('removeModelConcept calls onUpdateModelConcept prop function with null as argument', () => {
        component.instance().removeModelConcept();
        expect(mockProps.onUpdateModelConcept).toHaveBeenCalledWith(null);
    });
    it('selectConcept calls onUpdateModelConcept prop function with e.value as argument', () => {
        const e = {
            value: 'so spicy'
        }
        component.instance().selectConcept(e);
        expect(mockProps.onUpdateModelConcept).toHaveBeenCalledWith('so spicy');
    });
});