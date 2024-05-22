import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import classroomLesson from './classroomLesson';
import classroomLessons from './classroomLessons'; // this is the admin one
import classroomLessonsReviews from './classroomLessonsReviews';
import classroomSessions from './classroomSessions';
import concepts from './concepts';
import customize, * as FromCustomize from './customize';
import display from './display';
import filters from './filtersReducer';
import massEdit from './massEdit';

const combinedReducers = combineReducers({
  classroomLesson,
  classroomLessons,
  classroomLessonsReviews,
  classroomSessions,
  concepts,
  customize,
  display,
  filters,
  massEdit,
  routing: routerReducer,
});

export default combinedReducers;

export function getIncompleteQuestions(store) {
  return FromCustomize.getIncompleteQuestions(store.customize);
}

export function getStoredEditionMetadata(store, props) {
  const editionId = props.match.params.editionID;
  const editions = FromCustomize.getEditionMetadata(store.customize);

  return editions[editionId];
}

export function getStoredEditionQuestions(store) {
  return FromCustomize.getEditionQuestions(store.customize);
}

export function getStoredOriginalEditionQuestions(store) {
  return FromCustomize.getOriginalEditionQuestions(store.customize);
}
