import _ from 'lodash';
import { push } from 'react-router-redux';
import { requestGet, requestPost, requestPut } from '../utils/request';

const C = require('../constants').default;

const titleCardApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v2/title_cards`;

function startListeningToTitleCards() {
  return loadTitleCards();
}

function loadTitleCards() {
  return (dispatch) => {
    requestGet(`${titleCardApiBaseUrl}.json`).then((body) => {
      let titleCards = body.title_cards.reduce((obj, item) => {
        return Object.assign(obj, {[item.uid]: item});
      }, {});
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: titleCards, });
    );
  };
}

function loadSpecifiedTitleCards(uids) {
  return (dispatch, getState) => {
    const requestPromises = [];
    uids.forEach((uid) => {
      requestPromises.push(requestGet(`${titleCardApiBaseUrl}/${uid}.json`));
    });
    const allPromises = Promise.all(requestPromises);
    const questionData = {};
    allPromises.then((results) => {
      results.forEach((result) => {
        questionData[result.uid] = result;
      });
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: questionData, });
    });
  }
}

function submitNewTitleCard(content) {
  return (dispatch) => {
    requestPost(`${titleCardApiBaseUrl}.json`, content).then((body) => {
      dispatch(loadTitleCards());
      const action = push(`/admin/title-cards/${newRef.key}`);
      dispatch(action);
    })
    .catch((body) => {
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
    });
  };
}

function submitTitleCardEdit(qid, content) {
  return (dispatch, getState) => {
    requestPut(`${titleCardApiBaseUrl}/${qid}.json`, content).then((body) => {
      dispatch(loadTitleCards());
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      const action = push(`/admin/title-cards/${qid}`);
      dispatch(action);
    }).catch((body) => {
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${body}`, });
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
