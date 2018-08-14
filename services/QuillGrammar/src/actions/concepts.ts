import * as request from 'request';
import _ from 'underscore';

import { ActionTypes } from './actionTypes'

const conceptsEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/concepts.json`;

function splitInLevels(concepts) {
  return _.groupBy(concepts, 'level');
}

function getParentName(concept, concepts) {
  const parent = concepts['1'].find(c => c.id === concept.parent_id)
  const grandParent = concepts['2'].find(c => c.id === parent.parent_id)
  return `${grandParent.name} | ${parent.name}`;
}

export const startListeningToConcepts = () => {
  return dispatch => {
    request(conceptsEndpoint, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const concepts = splitInLevels(JSON.parse(body).concepts);
        concepts['0'] = concepts['0'].map((concept) => {
          concept.displayName = `${getParentName(concept, concepts)} | ${concept.name}`;
          return concept;
        });
        dispatch({ type: ActionTypes.RECEIVE_CONCEPTS_DATA, data: concepts, });
      }
    });
  };
}
