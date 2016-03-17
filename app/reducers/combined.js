import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducer';
import { routerReducer } from 'react-router-redux'

const findAndFix = combineReducers({
  question,
  routing: routerReducer
})

export default findAndFix
