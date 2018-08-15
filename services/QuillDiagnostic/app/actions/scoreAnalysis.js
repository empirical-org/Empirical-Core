const C = require('../constants').default;

import rootRef from '../libs/firebase';

const	scoreAnalysisRef = rootRef.child('diagnostic_datadash');
const setTimeoutRef = rootRef.child('timeouts/diagnostic_datadash');
import _ from 'lodash';
import request from 'request';

const moment = require('moment');

export function loadScoreData() {
  console.log('loading');
  return function (dispatch, getState) {
    scoreAnalysisRef.once('value', (snapshot) => {
      console.log('Snap: ', snapshot.val());
      dispatch({ type: C.RECEIVE_SCORE_ANALYSIS_DATA, data: snapshot.val(), });
    });
  };
}

export function updateData() {
  request(`${process.env.QUILL_CMS}/stats/diagnostic_question_health_index`, (error, response, body) => {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    } else {
      console.log('ok!')
    }
  });
}

export function checkTimeout() {
  setTimeoutRef.on('value', (snapshot) => {
    console.log('time now: ', moment().format('x'));
    console.log('time at snapshot: ', snapshot.val());
    if (moment().format('x') - (snapshot.val() || 0) > 300000) {
      setTimeoutRef.set(moment().format('x'));
      updateData()
    }
  });
}
