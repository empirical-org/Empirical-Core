import {
  completeQuestion,
  updateSubmission,
  UPDATE_SUBMISSION, 
  COMPLETE_QUESTION,
  markArticleAsRead,
  READ_ARTICLE
} from './activities';

test('returns the correct action from completeQuestion', () => {
  expect(completeQuestion(1)).toEqual({type: COMPLETE_QUESTION, data: {questionId: 1}});
  expect(completeQuestion(2)).toEqual({type: COMPLETE_QUESTION, data: {questionId: 2}});
});

test('returns the correct action from updateSubmission', () => {
  expect(updateSubmission(1, "abc")).toEqual({type: UPDATE_SUBMISSION, data: {questionId: 1, submission: "abc"}});
  expect(updateSubmission(2, "def")).toEqual({type: UPDATE_SUBMISSION, data: {questionId: 2, submission: "def"}});
});

test('returns the correct action from markArticleAsRead', () => {
  expect(markArticleAsRead()).toEqual({type: READ_ARTICLE})
})