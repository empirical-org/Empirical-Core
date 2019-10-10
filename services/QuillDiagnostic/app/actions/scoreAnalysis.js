const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	scoreAnalysisRef = rootRef.child('diagnostic_datadash');
const setTimeoutRef = rootRef.child('timeouts/diagnostic_datadash');
import _ from 'lodash';
import request from 'request';

const moment = require('moment');

export function loadScoreData() {
  return function (dispatch, getState) {
    scoreAnalysisRef.once('value', (snapshot) => {
      dispatch({ type: C.RECEIVE_SCORE_ANALYSIS_DATA, data: snapshot.val(), });
    });
  };
}

export function updateData() {
  request(`${process.env.QUILL_CMS}/stats/diagnostic_question_health_index`, (error, response, body) => {
    if (error) {
      // to do, use Sentry to capture error
    }
  });
}

export function checkTimeout() {
  setTimeoutRef.on('value', (snapshot) => {
    if (moment().format('x') - (snapshot.val() || 0) > 300000) {
      setTimeoutRef.set(moment().format('x'));
      updateData()
    }
  });
}
