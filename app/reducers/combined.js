import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducerV2';
import playLesson from './questionReducer';
import questions from './questions';
import sentenceFragments from './sentenceFragments';
import questionSelect from './questionSelect';
import concepts from './concepts';
import conceptsFeedback from './concepts-feedback';
import itemLevels from './item-levels'
import playDiagnostic from './diagnostics'
import lessons from './lessons';
import pathways from './pathways';
import responses from './responseReducer';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  concepts,
  conceptsFeedback,
  itemLevels,
  questions,
  sentenceFragments,
  questionSelect,
  pathways,
  responses,
  lessons,
  playLesson,
  playDiagnostic,
  routing: routerReducer
})

export default findAndFix
