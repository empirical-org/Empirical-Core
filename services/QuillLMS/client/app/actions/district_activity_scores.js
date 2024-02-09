import Pusher from 'pusher-js';

import { requestGet, } from '../modules/request/index';

export const receiveDistrictActivityScores = (body) => {
  return { type: 'RECIEVE_DISTRICT_ACTIVITY_SCORES', body, };
};

export const switchClassroom = (classroom) => {
  return { type: 'SWITCH_CLASSROOM', classroom, };
};

export const switchSchool = (school) => {
  return { type: 'SWITCH_SCHOOL', school, };
};

export const switchTeacher = (teacher) => {
  return { type: 'SWITCH_TEACHER', teacher, };
}

export const initializePusherForDistrictActivityScores = (adminId) => {
  return (dispatch) => {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, cluster: process.env.PUSHER_CLUSTER });
    const channel = pusher.subscribe(adminId);
    channel.bind('district-activity-scores-found', () => {
      dispatch(getDistrictActivityScores())
    });
  }
}

export const getDistrictActivityScores = () => {
  return (dispatch) => {
    requestGet(
      `${process.env.DEFAULT_URL}/api/v1/progress_reports/district_activity_scores`,
      (body) => {
        if (body.id) {
          dispatch(initializePusherForDistrictActivityScores(String(body.id)))
        } else {
          dispatch(receiveDistrictActivityScores(body))
        }
      }
    );
  }
};
