import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducerV2';
import questions from './questions';
import concepts from './concepts';
import lessons from './lessons';
import pathways from './pathways';
import responses from './responseReducer';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  concepts,
  questions,
  pathways,
  responses,
  lessons,
  routing: routerReducer
})

export default findAndFix
