import { mount } from 'enzyme';
import * as React from 'react';
import { fillInBlankQuestionBlankAllowed, fillInBlankQuestionBlankNotAllowed } from '../../../test/data/test_data.js';
import { PlayFillInTheBlankQuestion } from '../playFillInTheBlankQuestion';

function setup() {
  const nextQuestion = jest.fn();
  const question = fillInBlankQuestionBlankAllowed;
  const dispatch = () => 'i do nothing';
  const props = { question, dispatch, nextQuestion, };
  const wrapper = mount(<PlayFillInTheBlankQuestion {...props} />);

  return {
    props,
    wrapper,
  };
}

describe('PlayFillInTheBlankQuestion component', () => {
  Object.defineProperty(document, 'getElementById', {
    writable: true,
    value: () => ({
      getBoundingClientRect() {
        return {
          left: 10,
          right: 320,
        };
      },
    }),
  });
  const { wrapper, props, } = setup();

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleSubmitResponse', () => {
    it('should call validateAllInputs', () => {
      const validateAllInputs = jest.spyOn(wrapper.instance(), 'validateAllInputs');
      wrapper.instance().handleSubmitResponse();
      expect(validateAllInputs).toHaveBeenCalled();
    });
  });

  describe('zipInputsAndText', () => {
    it('returns a string zipping inputs and texts', () => {
      wrapper.setState({ inputVals: ['the', 'a'], });
      expect(wrapper.instance().zipInputsAndText()).toBe('I have the friend named Marco who loves a football.');
    });
  });

  describe('the input fields', () => {
    it('know which one to update onChange', () => {
      wrapper.find('#input1').simulate('change', { target: { value: 'bar', }, });
      wrapper.find('#input0').simulate('change', { target: { value: 'foo', }, });
      expect(wrapper.state().inputVals).toEqual(['foo', 'bar']);
    });

    describe('errored input fields', () => {
      const inputErrors = {};
      it('renders if there are input errors in state', () => {
        const wrapper = mount(
          <PlayFillInTheBlankQuestion question={fillInBlankQuestionBlankNotAllowed} />
        );
        inputErrors[1] = true;
        wrapper.setState({ inputErrors, });
        expect(wrapper.find('.error')).toHaveLength(1);
      });
      it('does not renders if there are not input errors in state', () => {
        const wrapper = mount(
          <PlayFillInTheBlankQuestion question={fillInBlankQuestionBlankNotAllowed} />
        );
        delete inputErrors[1];
        wrapper.setState({ inputErrors, });
        expect(wrapper.find('.error')).toHaveLength(0);
      });
    });
  });
});
