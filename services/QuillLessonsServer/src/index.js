import newrelic from 'newrelic';
import dotenv from 'dotenv';
import r from 'rethinkdb';
import socketio from 'socket.io';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import http from 'http';
import path from 'path';
import rethinkdbConfig from './config/rethinkdb';
import { requestHandler } from './config/server';

dotenv.config();

const app = http.createServer(requestHandler);
const io = socketio(app);
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
  const options      = { algorithms: ['RS256'] }
  const pkey         = Buffer.from(process.env.JWT_PUBLIC_KEY, 'utf8');

  jwt.verify(token, pkey, options, (err, decodedToken) => {
    if (err) {
      throw err;
    } else {
      return decodedToken;
    }
  });
}

r.connect(rethinkdbConfig, (err, connection) => {
  if (err) {
    newrelic.noticeError(err)
    console.error(err)
  } else {
    io.on('connection', (client) => {
      client.on('authentication', (data) => {
        const adaptors   = { connection, client };
        const adminRoles = ['teacher', 'staff'];
        const authToken  = verifyToken(data.token);
        registerConnection(client);

        client.on('cleanDatabase', (data) => {
          if (process.env.NODE_ENV === 'test') {
            cleanDatabase({ ...adaptors, ...data });
          } else {
            console.error(`Cannot clean database in ${process.env.NODE_ENV}`);
          }
        });

        client.on('getAllEditionMetadataForLesson', (data) => {
          getAllEditionMetadataForLesson({ ...adaptors, ...data });
        })

        client.on('teacherConnected', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            teacherConnected({ ...adaptors, ...data });
          });
        });

        client.on('disconnect', () => {
          disconnect({ ...adaptors });
        });

        client.on('subscribeToClassroomLessonSession', (data) => {
          authorizeSession(data, authToken, () => {
            subscribeToClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('createPreviewSession', (data) => {
          createPreviewSession({ ...adaptors, ...data });
        });

        client.on('updateClassroomLessonSession', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            updateClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('createOrUpdateClassroomLessonSession', (data) => {
          authorizeSession(data, authToken, () => {
            createOrUpdateClassroomLessonSession({ ...adaptors, ...data });
          });
        });

        client.on('setSlideStartTime', (data) => {
          authorizeSession(data, authToken, () => {
            setSlideStartTime({ ...adaptors, ...data });
          });
        });

        client.on('registerPresence', (data) => {
          registerPresence({ ...adaptors, ...data });
        });

        client.on('addStudent', (data) => {
          authorizeSession(data, authToken, () => {
            addStudent({ ...adaptors, ...data });
          });
        });

        client.on('saveStudentSubmission', (data) => {
          authorizeSession(data, authToken, () => {
            saveStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('removeStudentSubmission', (data) => {
          authorizeSession(data, authToken, () => {
            removeStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('removeMode', (data) => {
          authorizeSession(data, authToken, () => {
            removeMode({ ...adaptors, ...data });
          });
        });

        client.on('clearAllSelectedSubmissions', (data) => {
          authorizeSession(data, authToken, () => {
            clearAllSelectedSubmissions({ ...adaptors, ...data });
          });
        });

        client.on('clearAllSubmissions', (data) => {
          authorizeSession(data, authToken, () => {
            clearAllSubmissions({ ...adaptors, ...data });
          });
        });

        client.on('saveSelectedStudentSubmission', (data) => {
          authorizeSession(data, authToken, () => {
            saveSelectedStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('updateStudentSubmissionOrder', (data) => {
          authorizeSession(data, authToken, () => {
            updateStudentSubmissionOrder({ ...adaptors, ...data });
          });
        });

        client.on('removeSelectedStudentSubmission', (data) => {
          authorizeSession(data, authToken, () => {
            removeSelectedStudentSubmission({ ...adaptors, ...data });
          });
        });

        client.on('setMode', (data) => {
          authorizeSession(data, authToken, () => {
            setMode({ ...adaptors, ...data });
          });
        });

        client.on('setModel', (data) => {
          authorizeSession(data, authToken, () => {
            setModel({ ...adaptors, ...data });
          });
        });

        client.on('setPrompt', (data) => {
          authorizeSession(data, authToken, () => {
            setPrompt({ ...adaptors, ...data });
          });
        });

        client.on('toggleStudentFlag', (data) => {
          authorizeSession(data, authToken, () => {
            toggleStudentFlag({ ...adaptors, ...data });
          });
        });

        client.on('setWatchTeacherState', (data) => {
          authorizeSession(data, authToken, () => {
            setWatchTeacherState({ ...adaptors, ...data });
          });
        });

        client.on('removeWatchTeacherState', (data) => {
          authorizeSession(data, authToken, () => {
            removeWatchTeacherState({ ...adaptors, ...data });
          });
        });

        client.on('addStudents', (data) => {
          authorizeSession(data, authToken, () => {
            addStudents({ ...adaptors, ...data });
          });
        });

        client.on('redirectAssignedStudents', (data) => {
          authorizeSession(data, authToken, () => {
            redirectAssignedStudents({ ...adaptors, ...data });
          });
        });

        client.on('setClassroomName', (data) => {
          authorizeSession(data, authToken, () => {
            setClassroomName({ ...adaptors, ...data });
          });
        });

        client.on('setTeacherName', (data) => {
          authorizeSession(data, authToken, () => {
            setTeacherName({ ...adaptors, ...data });
          });
        });

        client.on('addFollowUpName', (data) => {
          authorizeSession(data, authToken, () => {
            addFollowUpName({ ...adaptors, ...data });
          });
        });

        client.on('addSupportingInfo', (data) => {
          authorizeSession(data, authToken, () => {
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
          authorizeRole(adminRoles, data, authToken, () => {
            createOrUpdateClassroomLesson({ ...adaptors, ...data });
          });
        });

        client.on('deleteClassroomLesson', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            deleteClassroomLesson({ ...adaptors, ...data });
          });
        });

        client.on('getAllClassroomLessonReviews', () => {
          getAllClassroomLessonReviews({ ...adaptors });
        });

        client.on('createOrUpdateReview', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
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
          authorizeRole(adminRoles, data, authToken, () => {
            updateEditionMetadata({ ...adaptors, ...data });
          });
        });

        client.on('setEditionId', (data) => {
          authorizeSession(data, authToken, () => {
            setEditionId({ ...adaptors, ...data });
          });
        });

        client.on('deleteEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            deleteEdition({ ...adaptors, ...data });
          });
        });

        client.on('updateEditionSlides', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            updateEditionSlides({ ...adaptors, ...data });
          });
        })

        client.on('updateSlideScriptItems', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            updateSlideScriptItems({ ...adaptors, ...data });
          });
        });

        client.on('saveEditionSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            saveEditionSlide({ ...adaptors, ...data });
          });
        });

        client.on('saveEditionScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            saveEditionScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('deleteScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            deleteScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('addScriptItem', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            addScriptItem({ ...adaptors, ...data });
          });
        });

        client.on('deleteEditionSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            deleteEditionSlide({ ...adaptors, ...data });
          });
        });

        client.on('addSlide', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            addSlide({ ...adaptors, ...data });
          });
        });

        client.on('setTeacherModels', (data) => {
          authorizeSession(data, authToken, () => {
            setTeacherModels({ ...adaptors, ...data });
          });
        });

        client.on('createNewEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            createNewEdition({ ...adaptors, ...data });
          });
        });

        client.on('publishEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            publishEdition({ ...adaptors, ...data });
          });
        });

        client.on('archiveEdition', (data) => {
          authorizeRole(adminRoles, data, authToken, () => {
            archiveEdition({ ...adaptors, ...data });
          });
        });
      });
    });
  }
});

app.listen(port, () => {
  console.log(`Node server started and listening at ${port}`)
});
