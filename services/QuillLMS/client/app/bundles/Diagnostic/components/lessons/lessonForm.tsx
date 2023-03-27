import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';
import { connect } from 'react-redux';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import {
  hashToCollection,
  SortableList,
  TextEditor
} from '../../../Shared/index';
import { Lesson } from '../../interfaces/lesson';
import { ConceptsReducerState } from '../../reducers/concepts';
import { ConceptsFeedbackReducerState } from '../../reducers/conceptsFeedback';
import { FillInBlankReducerState } from '../../reducers/fillInBlank';
import { QuestionsReducerState } from '../../reducers/questions';
import { SentenceFragmentsReducerState } from '../../reducers/sentenceFragments';
import { TitleCardsReducerState } from '../../reducers/titleCards';
import ChooseModel from './chooseModel';
import { DeleteButton, NameInput } from './lessonFormComponents.tsx';

export interface LessonFormProps {
  concepts: ConceptsReducerState,
  conceptsFeedback: ConceptsFeedbackReducerState,
  currentValues: Lesson,
  dispatch(action: any): any,
  fillInBlank: FillInBlankReducerState,
  lesson: Lesson,
  questions: QuestionsReducerState,
  sentenceFragments: SentenceFragmentsReducerState,
  stateSpecificClass?: string
  submit(object: {
    name: string,
    questions: Array<Object>,
    landingPageHtml: string,
    flag: string,
    modelConceptUID: string,
    isELL: boolean
  }): void,
  titleCards: TitleCardsReducerState,
}

export interface LessonFormState {
  flag: string,
  introURL: string,
  isELL: boolean,
  landingPageHtml: string,
  modelConceptUID: string,
  name: string,
  questionType: string,
  selectedQuestions: {
    key: string,
    questionType: string
  }[]
}


export class LessonForm extends React.Component<LessonFormProps, LessonFormState> {
  constructor(props) {
    super(props)

    const { flag, introURL, isELL, landingPageHtml, modelConceptUID, name, questions } = props.currentValues || {}; // eslint-disable-line react/destructuring-assignment

    this.state = {
      flag: flag || 'alpha',
      introURL: introURL || '',
      isELL: isELL || false,
      landingPageHtml: landingPageHtml || '',
      modelConceptUID: modelConceptUID || null,
      name: name || '',
      questionType: 'questions',
      selectedQuestions: questions || [],
    }
  }

  handleSubmit = () => {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, isELL } = this.state;
    const { submit } = this.props;
    submit({
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID,
      isELL
    });
  }

  handleStateChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const changes = {};
    changes[key] = event.currentTarget.value;
    this.setState(changes);
  }

  handleQuestionChange = (value: string) => {
    const { selectedQuestions, questionType } = this.state;
    let newSelectedQuestions: any;
    const changedQuestion = selectedQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newSelectedQuestions = selectedQuestions.concat([{ key: value, questionType: questionType, }]);
    } else {
      newSelectedQuestions = selectedQuestions.filter(question => question !== changedQuestion);
    }
    this.setState({ selectedQuestions: newSelectedQuestions, });
  }

  handleSearchChange = (value: string) => {
    this.handleQuestionChange(value);
  }

  sortCallback = (sortInfo: {
    data: {
      items: {
        key: string,
        props: {
          defaultValue: string
        }
      }[]
    }
  }) => {
    const newOrder = sortInfo.map(item => {
      return { key: item.key, questionType: item.props.defaultValue }
    });
    this.setState({ selectedQuestions: newOrder });
  }

  renderQuestionSelect = () => {
    const { selectedQuestions } = this.state;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (selectedQuestions && selectedQuestions.length) {
      const questionsList = selectedQuestions.map((question: { key: string, questionType: string }) => {
        const questionObject = this.props[question.questionType].data[question.key]; // eslint-disable-line react/destructuring-assignment
        const prompt = questionObject ? questionObject.prompt : 'Question No Longer Exists';
        const promptOrTitle = questionObject && question.questionType === 'titleCards' ? questionObject.title : prompt
        return (
          <p className="sortable-list-item" defaultValue={question.questionType} key={question.key}>
            {promptOrTitle}
            {'\t\t'}
            <DeleteButton onChange={this.handleQuestionChange} questionId={question.key} />
          </p>
        );
      });
      return <SortableList data={questionsList} id="currently-selected-questions" key={selectedQuestions.length} sortCallback={this.sortCallback} />;
    } else {
      return <div id="currently-selected-questions">No questions</div>;
    }
  }

  renderSearchBox = () => {
    const { questionType } = this.state;
    const { data } = this.props.concepts; // eslint-disable-line react/destructuring-assignment
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    let options = hashToCollection(this.props[questionType].data); // eslint-disable-line react/destructuring-assignment
    const concepts = data[0];
    let formatted: {}[];
    if (options.length > 0) {
      if (questionType !== 'titleCards') {
        options = options.filter((option: { conceptID: string, flag: string }) => {
          const concept = concepts.find(concept => concept.uid === option.conceptID);
          if(concept && option.flag !== 'archived') {
            return concept;
          }
        });
        formatted = options.map((opt: { key: string, prompt: string } )=> {
          return { name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, };
        });
      } else {
        formatted = options.map((opt: { key: string, title: string }) => {
          return { name: opt.title, value: opt.key }
        });
      }
      return (
        <SelectSearch
          filterOptions={fuzzySearch}
          id="all-questions"
          key={questionType}
          onChange={this.handleSearchChange}
          options={formatted}
          placeholder="Search for a question"
          search={true}
        />
      );
    }
  }

  handleSelectFlag = (e: React.FocusEvent<HTMLSelectElement>) => {
    this.setState({ flag: e.currentTarget.value, });
  }

  handleSelectQuestionType = (e: React.FocusEvent<HTMLSelectElement>) => {
    this.setState({ questionType: e.currentTarget.value, });
  }

  onLandingPageChange = (e: string) => {
    this.setState({ landingPageHtml: e, });
  }

  handleELLChange = () => {
    const { isELL } = this.state;
    this.setState({ isELL: !isELL });
  }

  onUpdateModelConcept = (uid: string) => {
    this.setState({ modelConceptUID: uid });
  }

  render() {
    const { flag, isELL, landingPageHtml, modelConceptUID, name, selectedQuestions } = this.state;
    const { conceptsFeedback, stateSpecificClass } = this.props;
    return (
      <div className="box">
        <h4 className="title">Add New Activity</h4>
        <p className="control">
          <NameInput name={name} onChange={this.handleStateChange} />
        </p>
        <div className="control">
          <label className="label" htmlFor="landing-page-content">
            Landing Page Content
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={this.onLandingPageChange}
              id="landing-page-content"
              text={landingPageHtml || ''}
            />
          </label>
        </div>
        <br />
        <p className="control">
          <label className="label" htmlFor="flag">
            Flag
            <span className="select">
              <select defaultValue={flag} onBlur={this.handleSelectFlag}>
                <option value="alpha">alpha</option>
                <option value="beta">beta</option>
                <option value="gamma">gamma</option>
                <option value="production">production</option>
                <option value="archived">archived</option>
              </select>
            </span>
          </label>
        </p>
        <p className="control">
          <label className="label" htmlFor="ell-check-input">
            Is ELL?
            <span>
              <input
                aria-label="ell-check-input"
                checked={isELL}
                onChange={this.handleELLChange}
                type="checkbox"
              />
            </span>
          </label>
        </p>
        <p className="control">
          <label className="label" htmlFor="question-type">
            Question Type
            <span className="select">
              <select defaultValue="questions" id="question-type" onBlur={this.handleSelectQuestionType}>
                <option value="questions">Sentence Combining</option>
                <option value="sentenceFragments">Sentence Fragment</option>
                <option value="fillInBlank">Fill In the Blank</option>
                <option value="titleCards">Title Cards</option>
              </select>
            </span>
          </label>
        </p>
        <div className="control">
          <label className="label" htmlFor="currently-selected-questions">
            Currently Selected Questions -- {`Total: ${selectedQuestions.length}`}
            {this.renderQuestionSelect()}
          </label>
        </div>
        <label className="label" htmlFor="all-questions">
          All Questions
          {this.renderSearchBox()}
        </label>
        <br />
        <ChooseModel
          conceptsFeedback={conceptsFeedback}
          modelConceptUID={modelConceptUID}
          updateModelConcept={this.onUpdateModelConcept}
        />
        <p className="control">
          <button className={`button is-primary ${stateSpecificClass}`} onClick={this.handleSubmit} type="submit">Submit</button>
        </p>
      </div>
    );
  }
};

function select({ questions, concepts, sentenceFragments, conceptsFeedback, fillInBlank, titleCards }) {
  return {
    questions,
    concepts,
    sentenceFragments,
    conceptsFeedback,
    fillInBlank,
    titleCards
  };
}

export default connect(select)(LessonForm);
