import request from 'request';
import _ from 'underscore';

const C = require('../constants').default;

const conceptsEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/concepts.json`;

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
      request(conceptsEndpoint, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const concepts = splitInLevels(JSON.parse(body).concepts);
          concepts['0'] = concepts['0'].map((concept) => {
            concept.displayName = `${getParentName(concept, concepts)} | ${concept.name}`;
            return concept;
          });
          dispatch({ type: C.RECEIVE_CONCEPTS_DATA, data: concepts, });
        }
      });
    };
  },
};

export default actions;
