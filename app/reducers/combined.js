import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducer';
import questions from './questions';
import concepts from './concepts';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  concepts,
  questions,
  routing: routerReducer
})

export default findAndFix
