import _ from 'lodash';
import { push } from 'react-router-redux';
import { requestGet, requestPost, requestPut } from '../utils/request';

const C = require('../constants').default;

const titleCardApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/title_cards`;

interface TitleCardProps {
  uid: string;
  content: string;
  title: string;
}

interface TitleCardBatchProps {
  title_cards: TitleCardProps[];
}

class TitleCardApi {
  static getAll(): Promise<TitleCardBatchProps> {
    return requestGet(`${titleCardApiBaseUrl}.json`);
  }

  static get(uid: string): Promise<TitleCardProps> {
    return requestGet(`${titleCardApiBaseUrl}/${uid}.json`);
  }

  static create(data: TitleCardProps): Promise<TitleCardProps> {
    return requestPost(`${titleCardApiBaseUrl}.json`, data);
  }

  static update(uid: string, data: TitleCardProps): Promise<TitleCardProps> {
    return requestPut(`${titleCardApiBaseUrl}/${uid}.json`, data);
  }
}

function startListeningToTitleCards() {
  return loadTitleCards();
}

function loadTitleCards(): (any) => void {
  return (dispatch) => {
    TitleCardApi.getAll().then((body) => {
      const titleCards = body.title_cards.reduce((obj, item) => {
        return Object.assign(obj, {[item.uid]: item});
      }, {});
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: titleCards, });
    });
  };
}

function loadSpecifiedTitleCards(uids) {
  return (dispatch, getState) => {
    const requestPromises: Promise<TitleCardProps>[] = [];
    uids.forEach((uid) => {
      requestPromises.push(TitleCardApi.get(uid));
    });
    const allPromises: Promise<TitleCardProps[]> = Promise.all(requestPromises);
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
    TitleCardApi.create(content).then((body) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA_UPDATE, data: {[body.uid]: body} });
      const action = push(`/admin/title-cards/${body.uid}`);
      dispatch(action);
    })
    .catch((body) => {
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
    });
  };
}

function submitTitleCardEdit(uid, content) {
  return (dispatch, getState) => {
    TitleCardApi.update(uid, content).then((body) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA_UPDATE, data: {[body.uid]: body} });
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      const action = push(`/admin/title-cards/${uid}`);
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
