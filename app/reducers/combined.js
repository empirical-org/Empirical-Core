import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducer';
import concepts from './concepts';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  concepts,
  routing: routerReducer
})

export default findAndFix
