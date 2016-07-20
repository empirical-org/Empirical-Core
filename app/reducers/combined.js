import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducerV2';
import playLesson from './questionReducer';
import questions from './questions';
import questionSelect from './questionSelect';
import concepts from './concepts';
import conceptsFeedback from './concepts-feedback';
import lessons from './lessons';
import pathways from './pathways';
import responses from './responseReducer';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  concepts,
  conceptsFeedback,
  questions,
  questionSelect,
  pathways,
  responses,
  lessons,
  playLesson,
  routing: routerReducer
})

export default findAndFix
