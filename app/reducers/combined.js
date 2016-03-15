import { combineReducers } from 'redux';
import { SubmitActions } from '../actions';
import question from './questionReducer';

const findAndFix = combineReducers({
  question
})

export default findAndFix
