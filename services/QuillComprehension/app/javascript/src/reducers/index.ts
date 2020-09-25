import { combineReducers } from 'redux'

​import activities from './activities';

const combinedReducer = combineReducers({
  activities
})
​
export default combinedReducer