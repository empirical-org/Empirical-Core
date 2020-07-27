import newrelic from 'newrelic';
import nr from './config/newrelic'; // custom NR methods
import dotenv from 'dotenv';
import r from 'rethinkdb';
import socketio from 'socket.io';
import redis from 'socket.io-redis';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import http from 'http';
import path from 'path';
import rethinkdbConfig from './config/rethinkdb';
import { requestHandler } from './config/server';

const Sentry = require('@sentry/node');

if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.LESSONS_SENTRY_DSN,
    debug: false
  });
}

const captureSentryError = (err) => {
  if(process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }
}

const captureSentryMessage = (message) => {
  if(process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message);
  }
}

dotenv.config();

const app = http.createServer(requestHandler);
const io = socketio(app);
io.adapter(redis(process.env.REDISTOGO_URL));
const port = process.env.PORT;

import {
  subscribeToClassroomLessonSession,
  createPreviewSession,
  updateClassroomLessonSession,
  createOrUpdateClassroomLessonSession,
  setSlideStartTime,
  addStudent,
  addStudents,
  saveStudentSubmission,
  removeStudentSubmission,
  removeMode,
  clearAllSelectedSubmissions,
  clearAllSubmissions,
  saveSelectedStudentSubmission,
  updateStudentSubmissionOrder,
  removeSelectedSubmissionOrder,
  removeSelectedStudentSubmission,
  setMode,
  setModel,
  setPrompt,
  toggleStudentFlag,
  setWatchTeacherState,
  removeWatchTeacherState,
  redirectAssignedStudents,
  setClassroomName,
  setTeacherName,
  addFollowUpName,
  addSupportingInfo,
  setEditionId,
} from './handlers/sessions';

import {
  getAllClassroomLessonReviews,
  createOrUpdateReview,
} from './handlers/reviews';

import {
  subscribeToClassroomLesson,
  getAllClassroomLessons,
  createOrUpdateClassroomLesson,
  deleteClassroomLesson,
} from './handlers/lessons';

import {
  setTeacherModels,
  getAllEditionMetadata,
  getAllEditionMetadataForLesson,
  getEditionQuestions,
  updateEditionMetadata,
  deleteEdition,
  updateEditionSlides,
  updateSlideScriptItems,
  saveEditionSlide,
  saveEditionScriptItem,
  deleteScriptItem,
  addScriptItem,
  deleteEditionSlide,
  addSlide,
  updateEditionQuestions,
  createNewEdition,
  publishEdition,
  archiveEdition,
} from './handlers/editions';

import {
  authorizeSession,
  authorizeRole,
} from './handlers/authorization';

let currentConnections = {};

function teacherConnected({
  classroomSessionId,
  connection,
  client,
}) {
  let session = { id: classroomSessionId, absentTeacherState: false };
  currentConnections[client.id].role = 'teacher';
  currentConnections[client.id].classroomSessionId = classroomSessionId;

  updateClassroomLessonSession({
    connection,
    session,
  });
}

function disconnect({
  client,
  connection,
}) {
  if (currentConnections[client.id].role === 'teacher') {
    let session = {
      id: currentConnections[client.id].classroomSessionId,
      absentTeacherState: true
    };

    updateClassroomLessonSession({
      connection,
      session,
    });
  }

  if (currentConnections[client.id].role === 'student') {
    let session = {
      id: currentConnections[client.id].classroomSessionId,
      presence: {}
    };
    session['presence'][currentConnections[client.id].studentId] = false

    updateClassroomLessonSession({
      connection,
      session,
    });
  }

  delete currentConnections[client.id];
}

function registerPresence({
  connection,
  classroomSessionId,
  studentId,
  client,
}) {
  let session = { id: classroomSessionId, presence: {} }
  currentConnections[client.id].role = 'student';
  currentConnections[client.id].studentId = studentId;
  currentConnections[client.id].classroomSessionId = classroomSessionId;
  session.presence[studentId] = true;

  updateClassroomLessonSession({
    session,
    connection,
  });
}

function cleanDatabase({
  connection,
  ackCallback
}) {
  r.tableList()
    .run(connection)
    .then((list) => {
      if (list) {
        list.forEach((tableName) => {
          r.table(tableName).delete().run(connection)
        })
      }
    })
    .then(() => {
      ackCallback('ok')
    })
}

function registerConnection(socket) {
  currentConnections[socket.id] = {
    socket,
    roll: null,
  }
}

function verifyToken(token) {
  const options = { algorithms: ['RS256'] }
  const pkey = Buffer.from(process.env.JWT_PUBLIC_KEY, 'utf8');
  let isValid;
  let tokenData;

  jwt.verify(token, pkey, options, (err, decodedToken) => {
    if (err) {
      newrelic.noticeError(err)
      isValid = false;
    } else {
      tokenData = decodedToken.data;
      isValid = true;
    }
  });

  return { isValid: isValid, data: tokenData };
}

r.connect(rethinkdbConfig, (err, connection) => {
  if (err) {
    newrelic.noticeError(err);
    captureSentryError(err);
  } else {
    io.on('connection', (client) => {
      client.on('authentication', (data) => {
        const adaptors = { connection, client };
        const adminRoles = ['teacher', 'staff'];
        const authToken = verifyToken(data.token);
        registerConnection(client);

        client.on('cleanDatabase', (data) => {
          if (process.env.NODE_ENV === 'test') {
            cleanDatabase({ ...adaptors, ...data });
          } else {
            captureSentryMessage(`Cannot clean database in ${process.env.NODE_ENV}`);
            newrelic.noticeError(`Cannot clean database in ${process.env.NODE_ENV}`);
          }
        });

        const keyGetAllEditionMetadataForLesson = 'getAllEditionMetadataForLesson';
        client.on(keyGetAllEditionMetadataForLesson, (data) => {
          nr.track(keyGetAllEditionMetadataForLesson, () => {
            getAllEditionMetadataForLesson({ ...adaptors, ...data });
          });
        })

        const keyTeacherConnected = 'teacherConnected';
        client.on(keyTeacherConnected, (data) => {
          nr.track(keyTeacherConnected, () => {
            authorizeRole(adminRoles, data, authToken, client, () => {
              teacherConnected({ ...adaptors, ...data });
            });
          });
        });

        client.on('disconnect', () => {
          disconnect({ ...adaptors });
        });

        client.on('subscribeToClassroomLessonSession', (data) => {
          authorizeSession(data, authToken, client, () => {
            subscribeToClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('createPreviewSession', (data) => {
          createPreviewSession({ ...adaptors, ...data });
        });

        client.on('updateClassroomLessonSession', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            updateClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('createOrUpdateClassroomLessonSession', (data) => {
          authorizeSession(data, authToken, client, () => {
            createOrUpdateClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('setSlideStartTime', (data) => {
          authorizeSession(data, authToken, client, () => {
            setSlideStartTime({ ...adaptors, ...data });
          });
        });

        client.on('registerPresence', (data) => {
          registerPresence({ ...adaptors, ...data });
        });

        client.on('addStudent', (data) => {
          authorizeSession(data, authToken, client, () => {
            addStudent({ ...adaptors, ...data });
          });
        });

        client.on('saveStudentSubmission', (data) => {
          authorizeSession(data, authToken, client, () => {
            saveStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('removeStudentSubmission', (data) => {
          authorizeSession(data, authToken, client, () => {
            removeStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('removeMode', (data) => {
          authorizeSession(data, authToken, client, () => {
            removeMode({ ...adaptors, ...data });
          });
        });

        client.on('clearAllSelectedSubmissions', (data) => {
          authorizeSession(data, authToken, client, () => {
            clearAllSelectedSubmissions({ ...adaptors, ...data });
          });
        });

        client.on('clearAllSubmissions', (data) => {
          authorizeSession(data, authToken, client, () => {
            clearAllSubmissions({ ...adaptors, ...data });
          });
        });

        client.on('saveSelectedStudentSubmission', (data) => {
          authorizeSession(data, authToken, client, () => {
            saveSelectedStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('updateStudentSubmissionOrder', (data) => {
          authorizeSession(data, authToken, client, () => {
            updateStudentSubmissionOrder({ ...adaptors, ...data });
          });
        });

        client.on('removeSelectedStudentSubmission', (data) => {
          authorizeSession(data, authToken, client, () => {
            removeSelectedStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('setMode', (data) => {
          authorizeSession(data, authToken, client, () => {
            setMode({ ...adaptors, ...data });
          });
        });

        const keySetModel = 'setModel';
        client.on(keySetModel, (data) => {
          nr.track(keySetModel, () => {
            authorizeSession(data, authToken, client, () => {
              setModel({ ...adaptors, ...data });
            });
          });
        });


        client.on('setPrompt', (data) => {
          nr.track('setPrompt', () => {
            authorizeSession(data, authToken, client, () => {
              setPrompt({ ...adaptors, ...data });
            });
          });
        });

        client.on('toggleStudentFlag', (data) => {
          authorizeSession(data, authToken, client, () => {
            toggleStudentFlag({ ...adaptors, ...data });
          });
        });

        const keySetWatchTeacherState = 'setWatchTeacherState';
        client.on(keySetWatchTeacherState, (data) => {
          nr.track(keySetWatchTeacherState, () => {
            authorizeSession(data, authToken, client, () => {
              setWatchTeacherState({ ...adaptors, ...data });
            });
          })
        });

        client.on('removeWatchTeacherState', (data) => {
          authorizeSession(data, authToken, client, () => {
            removeWatchTeacherState({ ...adaptors, ...data });
          });
        });

        client.on('addStudents', (data) => {
          authorizeSession(data, authToken, client, () => {
            addStudents({ ...adaptors, ...data });
          });
        });

        client.on('redirectAssignedStudents', (data) => {
          authorizeSession(data, authToken, client, () => {
            redirectAssignedStudents({ ...adaptors, ...data });
          });
        });

        client.on('setClassroomName', (data) => {
          authorizeSession(data, authToken, client, () => {
            setClassroomName({ ...adaptors, ...data });
          });
        });

        client.on('setTeacherName', (data) => {
          authorizeSession(data, authToken, client, () => {
            setTeacherName({ ...adaptors, ...data });
          });
        });

        client.on('addFollowUpName', (data) => {
          authorizeSession(data, authToken, client, () => {
            addFollowUpName({ ...adaptors, ...data });
          });
        });

        client.on('addSupportingInfo', (data) => {
          authorizeSession(data, authToken, client, () => {
            addSupportingInfo({ ...adaptors, ...data });
          });
        });

        client.on('subscribeToClassroomLesson', (data) => {
          subscribeToClassroomLesson({ ...adaptors, ...data })
        })

        client.on('getAllClassroomLessons', () => {
          getAllClassroomLessons({ ...adaptors })
        })

        client.on('createOrUpdateClassroomLesson', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            createOrUpdateClassroomLesson({ ...adaptors, ...data });
          });
        });

        client.on('deleteClassroomLesson', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            deleteClassroomLesson({ ...adaptors, ...data });
          });
        });

        client.on('getAllClassroomLessonReviews', () => {
          getAllClassroomLessonReviews({ ...adaptors });
        });

        client.on('createOrUpdateReview', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            createOrUpdateReview({ ...adaptors, ...data });
          });
        });

        client.on('getAllEditionMetadata', () => {
          getAllEditionMetadata({ ...adaptors });
        })

        client.on('getAllEditionMetadataForLesson', (data) => {
          getAllEditionMetadataForLesson({ ...adaptors, ...data });
        })

        client.on('getEditionQuestions', (data) => {
          getEditionQuestions({ ...adaptors, ...data });
        })

        client.on('updateEditionMetadata', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            updateEditionMetadata({ ...adaptors, ...data });
          });
        });

        client.on('setEditionId', (data) => {
          authorizeSession(data, authToken, client, () => {
            setEditionId({ ...adaptors, ...data });
          });
        });

        client.on('deleteEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            deleteEdition({ ...adaptors, ...data });
          });
        });

        client.on('updateEditionSlides', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            updateEditionSlides({ ...adaptors, ...data });
          });
        })

        client.on('updateSlideScriptItems', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            updateSlideScriptItems({ ...adaptors, ...data });
          });
        });

        client.on('saveEditionSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            saveEditionSlide({ ...adaptors, ...data });
          });
        });

        client.on('saveEditionScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            saveEditionScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('deleteScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            deleteScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('addScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            addScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('deleteEditionSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            deleteEditionSlide({ ...adaptors, ...data });
          });
        });

        client.on('addSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            addSlide({ ...adaptors, ...data });
          });
        });

        client.on('setTeacherModels', (data) => {
          authorizeSession(data, authToken, client, () => {
            setTeacherModels({ ...adaptors, ...data });
          });
        });

        client.on('createNewEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            createNewEdition({ ...adaptors, ...data });
          });
        });

        client.on('publishEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            publishEdition({ ...adaptors, ...data });
          });
        });

        client.on('archiveEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, client, () => {
            archiveEdition({ ...adaptors, ...data });
          });
        });
        client.on('error', err => {
          newrelic.noticeError(err);
          captureSentryError(err);
        });
      });
    });
  }
});

app.on('error', err => {
  newrelic.noticeError(err);
  captureSentryError(err);
});

app.listen(port, () => {});

