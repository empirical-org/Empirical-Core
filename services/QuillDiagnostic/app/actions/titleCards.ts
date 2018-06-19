import _ from 'lodash';
import { push } from 'react-router-redux';
import rootRef from '../libs/firebase';

const	titleCardsRef = rootRef.child('titleCards')
// const moment = require('moment');
const C = require('../constants').default;

function startListeningToTitleCards() {
  return (dispatch) => {
    titleCardsRef.on('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: snapshot.val(), });
    });
  };
}

function submitNewTitleCard(content) {
  return (dispatch) => {
    const newRef = titleCardsRef.push(content, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        const action = push(`/admin/title-cards/${newRef.key}`);
        dispatch(action);
      }
    });
  };
}

function submitTitleCardEdit(qid, content) {
  return (dispatch, getState) => {
    titleCardsRef.child(qid).update(content, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
        const action = push(`/admin/title-cards/${qid}`);
        dispatch(action);
      }
    });
  };
}

export { submitNewTitleCard, startListeningToTitleCards, submitTitleCardEdit }
