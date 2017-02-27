const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	scoreAnalysisRef = rootRef.child('datadash');
import _ from 'lodash';

module.exports = {
	// called when the app starts. this means we immediately download all questions, and
	// then receive all questions again as soon as anyone changes anything.
  loadScoreData() {
    return function (dispatch, getState) {
      scoreAnalysisRef.once('value', (snapshot) => {
        dispatch({ type: C.RECEIVE_SCORE_ANALYSIS_DATA, data: snapshot.val(), });
      });
    };
  },
};
