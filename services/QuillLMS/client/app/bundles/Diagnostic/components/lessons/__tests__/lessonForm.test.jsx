import React from 'react';
import { shallow } from 'enzyme';
import { LessonForm } from '../lessonForm';
import {
  SortableList,
  TextEditor
} from '../../../../Shared/index';
import { EditorState, ContentState } from 'draft-js'
import ChooseModel from '../chooseModel.tsx'
import _ from 'underscore';
import { NameInput } from '../lessonFormComponents.tsx';

describe('LessonForm component', () => {
  const mockQuestions = [
    { key: '-KOqLeXEvMjNuE6MGOop', questionType: 'sentenceFragments' },
    { key: '-KdCgy8wt_rQiYpOURdW', questionType: 'fillInBlank' },
    { key: '-KdChHgbE9377Jgzkoci', questionType: 'fillInBlank' }
  ];
  const mockQuestionData = {
    '-KOqLeXEvMjNuE6MGOop': {
      conceptID: 'b5JpyWZYjhb94LTXGmYy7g',
      flag: 'production',
      key: '-KOqLeXEvMjNuE6MGOop',
      prompt: 'How much cheese is too much cheese?',
      title: 'Question 1'
    },
    '-KdCgy8wt_rQiYpOURdW': {
      conceptID: 'b5JpyWZYjhb94LTXGmYy7g',
      flag: 'production',
      key: '-KdCgy8wt_rQiYpOURdW',
      prompt: 'What is the best way to cultivate mass?',
      title: 'Question 2'
    },
    '-KdChHgbE9377Jgzkoci': {
      conceptID: 'b5JpyWZYjhb94LTXGmYy7g',
      flag: 'production',
      key: '-KdChHgbE9377Jgzkoci',
      prompt: 'Do jobs grow on jobbies?',
      title: 'Question 3'
    }
  };
  const mockProps = {
    currentValues: {
      flag: 'beta',
      isELL: true,
      landingPageHtml: '<p>Test content</p>',
      modelConceptUID: 'QsC1lua0t41_J2em_c7kUA',
      name: 'Awesome Diagnostic',
      questions: mockQuestions
    },
    lesson: {
      flag: 'beta',
      isELL: true,
      landingPageHtml: '<p>Test content</p>',
      modelConceptUID: 'QsC1lua0t41_J2em_c7kUA',
      name: 'Awesome Diagnostic',
      questions: mockQuestions
    },
    submit: jest.fn(),
    questions: {
      hasreceiveddata: true,
      submittingnew: false,
      states: {},
      data: mockQuestionData
    },
    concepts: {
      hasreceiveddata: true,
      submittingnew: false,
      states: {},
      data: {
        0: [{
          id: 589,
          name: 'Past Perfect',
          parent_id: 572,
          uid: 'b5JpyWZYjhb94LTXGmYy7g',
          description: null,
          level: 0,
          displayName: 'Verbs | Perfect Tense | Past Perfect'
        }]
      }
    },
    sentenceFragments: {
      hasreceiveddata: true,
      submittingnew: false,
      states: {},
      data: mockQuestionData
    },
    conceptsFeedback: {
      hasreceiveddata: true,
      submittingnew: false,
      states: {},
      data: mockQuestionData
    },
    fillInBlank: {
      hasreceiveddata: true,
      submittingnew: false,
      states: {},
      data: mockQuestionData
    },
    titleCards: {
      hasreceiveddata: true,
      data: {}
    },
    dispatch: jest.fn()
  };
  const container = shallow(<LessonForm {...mockProps} />);
  it('renders NameInput, TextEditor and ChooseModel components, passing expected props', () => {
    const handleStateChange = container.instance().handleStateChange;
    const onLandingPageChange = container.instance().onLandingPageChange;
    const handleUpdateModelConcept = container.instance().handleUpdateModelConcept;
    const nameInput= container.find(NameInput);
    const textEditor = container.find(TextEditor);
    const chooseModel = container.find(ChooseModel);

    expect(nameInput.length).toEqual(1);
    expect(TextEditor.length).toEqual(1);
    expect(chooseModel.length).toEqual(1);
    expect(nameInput.props().name).toEqual('Awesome Diagnostic');
    expect(nameInput.props().onChange).toEqual(handleStateChange);
    expect(textEditor.props().ContentState).toEqual(ContentState);
    expect(textEditor.props().EditorState).toEqual(EditorState);
    expect(textEditor.props().handleTextChange).toEqual(onLandingPageChange);
    expect(textEditor.props().text).toEqual('<p>Test content</p>');
    expect(chooseModel.props().conceptsFeedback).toEqual(mockProps.conceptsFeedback);
    expect(chooseModel.props().modelConceptUID).toEqual('QsC1lua0t41_J2em_c7kUA');
    expect(chooseModel.props().onUpdateModelConcept).toEqual(handleUpdateModelConcept);
  });
  it('handleSubmit calls submit() prop function passing name, questions: selectedQuestions, landingPageHtml, flag, modelConceptUID, and isELL as arguments', () => {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, isELL } = container.state();
    const argument = {
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID,
      isELL
    };
    container.instance().handleSubmit();
    expect(mockProps.submit).toHaveBeenCalledWith(argument);
  });
  it('handleStateChange updates specific piece of state, using key and event arguments to build object to pass to setState', () => {
    const event = {
      currentTarget: {
        value: 'Even Moar Awesome Diagnostic'
      }
    };
    container.instance().handleStateChange('name', event);
    expect(container.state().name).toEqual(event.currentTarget.value);
  });
  it('handleQuestionChange updates selectedQuestions piece of state if question is added or deleted', () => {
    container.instance().handleQuestionChange('-KdChHgbE9212Jgzkoci');
    expect(container.state().selectedQuestions.length).toEqual(4);
    expect(container.state().selectedQuestions[3]).toEqual({ key: '-KdChHgbE9212Jgzkoci', questionType: 'questions'});
    container.instance().handleQuestionChange('-KdChHgbE9212Jgzkoci');
    expect(container.state().selectedQuestions.length).toEqual(3);
  });
  it('handleSearchChange calls handleQuestionChange, passing value as an argument', () => {
    const handleQuestionChange = jest.spyOn(container.instance(), 'handleQuestionChange');
    const value = 'saideira';
    container.instance().handleSearchChange(value);
    expect(handleQuestionChange).toHaveBeenCalledWith(value);
  });
  it('sortCallback sets selectedQuestion piece of state to reordered array of questions', () => {
    const sortInfo = [
      {
        $$typeof: 'Symbol(react.element)',
        type: 'p',
        key: '-KdCgy8wt_rQiYpOURdW',
        ref: null,
        props: {
          className: 'sortable-list-item',
          defaultValue: 'fillInBlank',
          children: []
        }
      },
      {
        $$typeof: 'Symbol(react.element)',
        type: 'p',
        key: '-KOqLeXEvMjNuE6MGOop',
        ref: null,
        props: {
          className: 'sortable-list-item',
          defaultValue: 'sentenceFragments',
          children: []
        }
      },
      {
        $$typeof: 'Symbol(react.element)',
        type: 'p',
        key: '-KdChHgbE9377Jgzkoci',
        ref: null,
        props: {
          className: 'sortable-list-item',
          defaultValue: 'fillInBlank',
          children: []
        }
      },
    ]
    const newOrder = [
      { key: '-KdCgy8wt_rQiYpOURdW', questionType: 'fillInBlank' },
      { key: '-KOqLeXEvMjNuE6MGOop', questionType: 'sentenceFragments' },
      { key: '-KdChHgbE9377Jgzkoci', questionType: 'fillInBlank' }
    ];
    container.setState({ selectedQuestions: mockQuestions });
    container.instance().sortCallback(sortInfo);
    expect(container.state().selectedQuestions).toEqual(newOrder);
  });
  it('renderQuestionSelect renders a SortableList component of selectedQuestions', () => {
    const keys = ['-KdCgy8wt_rQiYpOURdW', '-KOqLeXEvMjNuE6MGOop', '-KdChHgbE9377Jgzkoci'];
    const sortableList = container.find(SortableList);
    const getQuestionKey = i => sortableList.props().data[i].key;
    container.instance().renderQuestionSelect();
    expect(sortableList.length).toEqual(1);
    expect(getQuestionKey(0)).toEqual(keys[0])
    expect(getQuestionKey(1)).toEqual(keys[1])
    expect(getQuestionKey(2)).toEqual(keys[2])
  });
  it('renderSearchBox renders a SelectSearch component with question options', () => {
    const names = ['How much cheese is too much cheese?', 'What is the best way to cultivate mass?', 'Do jobs grow on jobbies?'];
    const handleSearchChange = container.instance().handleSearchChange;
    const selectSearch = container.find('#all-questions');
    const getQuestionName = i => selectSearch.props().options[i].name;
    container.instance().renderSearchBox();
    expect(container).toMatchSnapshot()
    expect(selectSearch.length).toEqual(1);
    expect(selectSearch.props().onChange).toEqual(handleSearchChange);
    expect(getQuestionName(0)).toEqual(names[0]);
    expect(getQuestionName(1)).toEqual(names[1]);
    expect(getQuestionName(2)).toEqual(names[2]);
  });
  it('handleSelectFlag updates the flag piece of state', () => {
    const e = {
      currentTarget: {
        value: 'alpha'
      }
    };
    container.instance().handleSelectFlag(e);
    expect(container.state().flag).toEqual(e.currentTarget.value);
  });
  it('handleSelectQuestionType updates the questionType piece of state', () => {
    const e = {
      currentTarget: {
        value: 'fillInBlank'
      }
    };
    container.instance().handleSelectQuestionType(e);
    expect(container.state().questionType).toEqual(e.currentTarget.value);
  });
  it('onLandingPageChange updates the landingPageHtml piece of state', () => {
    const e = '<p>Updated Content</p>'
    container.instance().onLandingPageChange(e);
    expect(container.state().landingPageHtml).toEqual(e);
  });
  it('handleELLChange updates isELL piece of state', () => {
    container.instance().handleELLChange();
    expect(container.state().isELL).toEqual(false);
  });
  it('onUpdateModelConcept updates modelConceptUID piece of state', () => {
    const id = 'new-id';
    container.instance().onUpdateModelConcept(id);
    expect(container.state().modelConceptUID).toEqual(id);
  });
});
