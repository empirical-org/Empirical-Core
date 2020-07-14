import * as request from 'request';
import * as _ from 'underscore';
import { ActionTypes } from './actionTypes'
import { Concept } from '../interfaces/concepts'
const conceptsEndpoint = `${process.env.DEFAULT_URL}/api/v1/concepts.json`;

function splitInLevels(concepts: Concept[]) {
  return _.groupBy(concepts, 'level');
}

function getParentName(concept: Concept, concepts: Concept[][]): string|void {
  const parent: Concept|undefined = concepts[1].find(c => c.id === concept.parent_id)
  if (parent) {
    const grandParent: Concept|undefined = concepts[2].find(c => c.id === parent.parent_id)
    if (grandParent) {
      return `${grandParent.name} | ${parent.name}`;
    }
  }
}
export const startListeningToConcepts = () => {
  return (dispatch: Function) => {
    request(conceptsEndpoint, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const concepts = splitInLevels(JSON.parse(body).concepts);
        concepts['0'] = concepts['0'].map((concept: Concept) => {
          concept.displayName = `${getParentName(concept, concepts)} | ${concept.name}`;
          return concept;
        });
        dispatch({ type: ActionTypes.RECEIVE_CONCEPTS_DATA, data: concepts, });
      }
    });
  };
}
