import { Action } from "redux";

export const ActionTypes = {
    //INIT STORE
    INIT_STORE: 'INIT_STORE',

    // GRAMMAR ACTIVITIES
    RECEIVE_GRAMMAR_ACTIVITY_DATA: 'RECEIVE_GRAMMAR_ACTIVITY_DATA',

    // QUESTIONS
    RECEIVE_QUESTION_DATA: 'RECEIVE_QUESTION_DATA',
    NO_QUESTIONS_FOUND: 'NO_QUESTIONS_FOUND',
};
//
export interface IInitStoreAction extends Action {
}
//
// export interface IAddTodoAction extends Action {
//     todo: TodoItem;
// }
//
// export interface ICompleteTodoAction extends Action {
//     todo: TodoItem;
// }
