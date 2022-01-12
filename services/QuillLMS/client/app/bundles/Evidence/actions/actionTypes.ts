import { Action } from "redux";

export const ActionTypes = {
    // INIT STORE
    INIT_STORE: 'INIT_STORE',

    // ACTIVITIES
    RECEIVE_ACTIVITY_DATA: 'RECEIVE_ACTIVITY_DATA',
    NO_ACTIVITY_FOUND: 'NO_ACTIVITY_FOUND',

    // SESSION
    SESION_HAS_NO_DATA: 'SESION_HAS_NO_DATA',
    SET_ACTIVITY_SESSION_ID: 'SET_ACTIVITY_SESSION_ID',
    SET_SUBMITTED_RESPONSES: 'SET_SUBMITTED_RESPONSES',
    RECORD_FEEDBACK: 'RECORD_FEEDBACK',
    SET_ACTIVE_STEP: 'SET_ACTIVE_STEP'
};
//
