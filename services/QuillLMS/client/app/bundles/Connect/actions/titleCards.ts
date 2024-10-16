import { goBack, push } from 'react-router-redux';
import lessonActions from '../actions/lessons';
import { LessonApi, TYPE_CONNECT_LESSON } from '../libs/lessons_api';
import { CONNECT_TITLE_CARD_TYPE, TitleCardApi } from '../libs/title_cards_api';

import C from '../constants';


function startListeningToTitleCards() {
  return loadTitleCards();
}

function loadTitleCards(): (any) => void {
  return (dispatch) => {
    TitleCardApi.getAll(CONNECT_TITLE_CARD_TYPE).then((body) => {
      let titleCards = body.title_cards || []
      const titleCardsObject = titleCards.reduce((obj, item) => {
        return Object.assign(obj, {[item.uid]: item});
      }, {});
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA, data: titleCardsObject, });
    });
  };
}

function submitNewTitleCard(content, response, lessonID) {
  return (dispatch) => {
    TitleCardApi.create(CONNECT_TITLE_CARD_TYPE, content).then((body) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA_UPDATE, data: {[body.uid]: body} });
      if (lessonID) {
        const lessonQuestion = {key: body['uid'], questionType: C.INTERNAL_TITLE_CARDS_TYPE}
        dispatch({ type: C.SUBMIT_LESSON_EDIT, cid: lessonID, });
        LessonApi.addQuestion(TYPE_CONNECT_LESSON, lessonID, lessonQuestion).then( () => {
          dispatch({ type: C.FINISH_LESSON_EDIT, cid: lessonID, });
          dispatch(lessonActions.loadLesson(lessonID));
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Question successfully added to lesson!', });
        }).catch( (error) => {
          dispatch({ type: C.FINISH_LESSON_EDIT, cid: lessonID, });
          dispatch({ type: C.DISPLAY_ERROR, error: `Add to lesson failed! ${error}`, });
        });
      } else {
        const action = push(`/admin/title-cards/${body.uid}`);
        dispatch(action);
      }
    })
      .catch((body) => {
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      });
  };
}

function submitTitleCardEdit(uid, content) {
  return (dispatch, getState) => {
    TitleCardApi.update(CONNECT_TITLE_CARD_TYPE, uid, content).then((body) => {
      dispatch({ type: C.RECEIVE_TITLE_CARDS_DATA_UPDATE, data: {[body.uid]: body} });
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      const action = goBack();
      dispatch(action);
    }).catch((body) => {
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${body}`, });
    });
  };
}

export default {
  submitNewTitleCard,
  loadTitleCards,
  startListeningToTitleCards,
  submitTitleCardEdit,
}
