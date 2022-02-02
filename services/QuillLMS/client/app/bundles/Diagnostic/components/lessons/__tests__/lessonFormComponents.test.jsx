import React from 'react';
import { shallow } from 'enzyme';
import { DeleteButton, NameInput } from '../lessonFormComponents.tsx';

describe('DeleteButton component', () => {
  const mockProps = {
    onChange: jest.fn(),
    questionId: 'birds-arent-real'
  };
  const component = shallow(<DeleteButton {...mockProps} />);
  it('should call onChange() prop function with questionId prop as argument when button is clicked', () => {
    component.find('button').simulate('click');
    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.questionId);
  });
});

describe('NameInput component', () => {
  const mockProps = {
    name: 'Donna Summer',
    onChange: jest.fn()
  };
  const component = shallow(<NameInput {...mockProps} />);
  it('should pass name prop to input element a value', () => {
    expect(component.find('input').props().value).toEqual(mockProps.name);
  });
  it('should call onChange() prop function with "name" and e arguments when input text changes', () => {
    const e = {
      target: {
        value: 'Queen of Disco'
      }
    };
    component.find('input').simulate('change', e);
    expect(mockProps.onChange).toHaveBeenCalledWith('name', e);
  });
});