import React from 'react';
import { mount } from 'enzyme';
import { PlayFillInTheBlankQuestion } from '../playFillInTheBlankQuestion';
import { fillInBlankQuestionBlankAllowed, fillInBlankQuestionBlankNotAllowed }
       from '../../../../test/data/jest_data.js';

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
    value: () => ({ getBoundingClientRect() {
      return {
        left: 10,
        right: 320,
      };
    }, }),
  });
  const { wrapper, props, } = setup();

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('checkAnswer', () => {
    it('should call nextQuestion if there are no inputErrors in state', () => {
      const nextQuestion = jest.fn();
      props.nextQuestion = nextQuestion;
      const wrapper = mount(<PlayFillInTheBlankQuestion {...props} />);
      wrapper.instance().checkAnswer();
      expect(nextQuestion.mock.calls.length).toBe(1);
    });

    it('should not call nextQuestion if there are inputErrors in state', () => {
      const nextQuestion = jest.fn();
      props.nextQuestion = nextQuestion;
      const inputErrors = new Set();
      inputErrors.add(1);
      const wrapper = mount(<PlayFillInTheBlankQuestion {...props} />);
      wrapper.setState({ inputErrors, });
      wrapper.instance().checkAnswer();
      expect(nextQuestion.mock.calls.length).toBe(0);
    });

    it('is triggered by clicking the submit button', () => {
      const nextQuestion = jest.fn();
      props.nextQuestion = nextQuestion;
      const wrapper = mount(<PlayFillInTheBlankQuestion {...props} />);
      wrapper.find('.button').simulate('click');
      expect(nextQuestion.mock.calls.length).toBe(1);
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

    describe('validateInput onBlur', () => {
      describe('updates this.state.inputErrors', () => {
        describe('by adding the index of the input if the input is', () => {
          it('not in the cues list', () => {
            wrapper.setState({ inputVals: ['', 'foo'], });
            wrapper.find('#input1').simulate('blur');
            expect(wrapper.state().inputErrors.has(1)).toBe(true);
          });
          it('empty and question.blankAllowed is false', () => {
            const wrapper = mount(<PlayFillInTheBlankQuestion question={fillInBlankQuestionBlankNotAllowed} />);
            wrapper.setState({ inputVals: ['', 'foo'], });
            wrapper.find('#input1').simulate('blur');
            expect(wrapper.state().inputErrors.has(1)).toBe(true);
          });
        });
        describe('by removing the index of the input if the input is', () => {
          const inputErrorSet = new Set();
          inputErrorSet.add(1);
          const someState = { inputVals: ['', 'a'], };

          it('in the cues list', () => {
            wrapper.setState(someState);
            wrapper.find('#input1').simulate('blur');
            expect(wrapper.state().inputErrors.has(1)).toBe(false);
          });

          it('empty and state.blankAllowed is true', () => {
            wrapper.setState({ inputVals: ['', 'a'], });
            wrapper.find('#input1').simulate('blur');
            expect(wrapper.state().inputErrors.has(1)).toBe(false);
          });
        });
      });
    });

    describe('warning dialogues', () => {
      const inputErrors = new Set();
      it('renders if there are input errors in state', () => {
        const wrapper = mount(
          <PlayFillInTheBlankQuestion question={fillInBlankQuestionBlankNotAllowed} />
        );
        inputErrors.add(1);
        wrapper.setState({ inputErrors, });
        expect(wrapper.find('.warning-dialogue')).toHaveLength(1);
      });
      it('does not renders if there are not input errors in state', () => {
        const wrapper = mount(
          <PlayFillInTheBlankQuestion question={fillInBlankQuestionBlankNotAllowed} />
        );
        inputErrors.delete(1);
        wrapper.setState({ inputErrors, });
        expect(wrapper.find('.warning-dialogue')).toHaveLength(0);
      });
    });
  });
});
