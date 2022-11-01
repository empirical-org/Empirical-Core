import _ from 'underscore';

import { requestGet, } from '../../../modules/request/index'

const C = require('../constants').default;

const conceptsEndpoint = `${process.env.DEFAULT_URL}/api/v1/concepts.json`;

function splitInLevels(concepts) {
  return _.groupBy(concepts, 'level');
}

function getParentName(concept, concepts) {
  const parent = _.find(concepts['1'], { id: concept.parent_id, });
  const grandParent = _.find(concepts['2'], { id: parent.parent_id, });
  return `${grandParent.name} | ${parent.name}`;
}

const actions = {
  startListeningToConcepts() {
    return (dispatch) => {
      requestGet(conceptsEndpoint, (body) => {
        const concepts = splitInLevels(body.concepts);
        concepts['0'] = concepts['0'].map((concept) => {
          concept.displayName = `${getParentName(concept, concepts)} | ${concept.name}`;
          return concept;
        });
        dispatch({ type: C.RECEIVE_CONCEPTS_DATA, data: concepts, });
      });
    };
  },
};

export default actions;
