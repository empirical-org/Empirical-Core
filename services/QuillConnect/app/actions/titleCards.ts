import _ from 'lodash';
import { push } from 'react-router-redux';
import rootRef from '../libs/firebase';

const	titleCardsRef = rootRef.child('titleCards')
const C = require('../constants').default;

function startListeningToTitleCards() {
  return (dispatch) => {
    titleCardsRef.on('value', (snapshot) => {
      if (snapshot) {
        dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: snapshot.val(), });
      }
    });
  };
}

function loadTitleCards() {
  return (dispatch) => {
    titleCardsRef.once('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: snapshot.val(), });
    });
  };
}

function loadSpecifiedTitleCards(uids) {
  return (dispatch, getState) => {
    const firebasePromises = [];
    uids.forEach((uid) => {
      firebasePromises.push(titleCardsRef.child(uid).once('value'));
    });
    const allPromises = Promise.all(firebasePromises);
    const questionData = {};
    allPromises.then((results) => {
      results.forEach((result) => {
        const value = result.val();
        questionData[result.key] = value;
      });
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: questionData, });
    });
  }
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

export {
  submitNewTitleCard,
  loadTitleCards,
  loadSpecifiedTitleCards,
  startListeningToTitleCards,
  submitTitleCardEdit,
}
