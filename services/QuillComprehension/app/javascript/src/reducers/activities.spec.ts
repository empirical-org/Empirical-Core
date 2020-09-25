import R from 'ramda'

import activityReducer, {
  initialState
} from './activities';

import { completeQuestion, updateSubmission, markArticleAsRead, chooseQuestionSet, setFontSize } from '../actions/activities';

test('returns the correct initial state if provided no actions', () => {
  expect(activityReducer()).toEqual(initialState);
});

test('returns the correct state when a question is completed', () => {
  const action = completeQuestion(1);
  const expectedState = R.mergeDeepRight(initialState, {complete: {1: true}})
  const newState = activityReducer(initialState, action)
  expect(newState).toEqual(expectedState);
  // Now complete a second question
  const action2 = completeQuestion(2);
  const expectedState2 = R.mergeDeepRight(newState, {complete: {2: true}})
  const newState2 = activityReducer(newState, action2)
  expect(newState2).toEqual(expectedState2);
});

test('returns the correct state when a submission is updated', () => {
  const action = updateSubmission(1, "abc")
  const expectedState = R.mergeDeepRight(initialState, {submissions: {1: "abc"}})
  const newState = activityReducer(initialState, action)
  expect(newState).toEqual(expectedState);
  // Now update a second submission
  const action2 = updateSubmission(2, "def")
  const expectedState2 = R.mergeDeepRight(newState, {submissions: {2: 'def'}})
  const newState2 = activityReducer(newState, action2)
  expect(newState2).toEqual(expectedState2);
  // Now update the first submission again
  const action3 = updateSubmission(1, "ghi")
  const expectedState3 = R.mergeDeepRight(newState2, {submissions: {1: 'ghi'}})
  const newState3 = activityReducer(newState2, action3)
  expect(newState3).toEqual(expectedState3);
})

test('returns the correct state when article is marked as read', () => {
  const action = markArticleAsRead();
  const expectedState = R.mergeDeepRight(initialState, {readArticle: true})
  expect(activityReducer(initialState, action )).toEqual(expectedState);
})

test('returns the correct state when question set is chosen', () => {
  const action = chooseQuestionSet(1);
  const expectedState = R.mergeDeepRight(initialState, {questionSetId: 1})
  expect(activityReducer(initialState, action )).toEqual(expectedState);
})

test('returns the correct state when fontsize is changed', () => {
  const action = setFontSize(1);
  const expectedState = R.mergeDeepRight(initialState, {fontSize: 1})
  expect(activityReducer(initialState, action )).toEqual(expectedState);
})

test('all together now...', () => {
  // Let's mark the article as read
  const action = markArticleAsRead();
  const expectedState = R.mergeDeepRight(initialState, {readArticle: true})
  const newState = activityReducer(initialState, action)
  expect(newState).toEqual(expectedState);
  // State: { submissions: {}, complete: {}, readArticle: true }
  
  // Now lets enter some text for the first question
  const action2 = updateSubmission(1, "def")
  const expectedState2 = R.mergeDeepRight(newState, {submissions: {1: 'def'}})
  const newState2 = activityReducer(newState, action2)
  expect(newState2).toEqual(expectedState2);
  
  // State: { submissions: { '1': 'def' }, complete: {}, readArticle: true }
  // Now lets complete the question
  const action3 = completeQuestion(1);
  const expectedState3 = R.mergeDeepRight(newState2, {complete: {1: true}})
  const newState3 = activityReducer(newState2, action3)
  expect(newState3).toEqual(expectedState3);
  // State: { submissions: { '1': 'def' }, complete: { '1': true }, readArticle: true }
  // Check for mutation
  expect(newState2).not.toEqual(newState3);
}) 