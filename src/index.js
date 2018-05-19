import dotenv from 'dotenv'
dotenv.config()
import r from 'rethinkdb'
import socketio from 'socket.io'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import http from 'http'
import path from 'path'
import rethinkdbConfig from './rethinkdbConfig'
const app = http.createServer(handler)
const io = socketio(app)
const port = process.env.NODE_PORT

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
} from './sessions'

import {
  saveReview,
  getAllClassroomLessonReviews,
  createOrUpdateReview,
} from './reviews'

import {
  subscribeToClassroomLesson,
  getAllClassroomLessons,
  createOrUpdateClassroomLesson,
  deleteClassroomLesson,
} from './lessons'

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
} from './editions'

let currentConnections = {};

function handler (req, res) {
  const indexPagePath = path.resolve(__dirname + '/..') + '/index.html'
  fs.readFile(indexPagePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html')
    }

    res.writeHead(200);
    res.end(data);
  });
}

function teacherConnected({
  classroomActivityId,
  connection,
  client,
}) {
  let session = { id: classroomActivityId, absentTeacherState: false };
  currentConnections[client.id].role = 'teacher';
  currentConnections[client.id].classroomActivityId = classroomActivityId;

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
      id: currentConnections[client.id].classroomActivityId,
      absentTeacherState: true
    };

    updateClassroomLessonSession({
      connection,
      session,
    });
  }

  if (currentConnections[client.id].role === 'student') {
    let session = {
      id: currentConnections[client.id].classroomActivityId,
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
  classroomActivityId,
  studentId,
  client,
}) {
  let session = { id: classroomActivityId, presence: {} }
  currentConnections[client.id].role = 'student';
  currentConnections[client.id].studentId = studentId;
  currentConnections[client.id].classroomActivityId = classroomActivityId;
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

r.connect(rethinkdbConfig, (err, connection) => {
  if (err) {
    console.error(err)
  } else {
    io.use((socket, next) => {
      const options = { algorithms: ['RS256'] }
      const pkey = process.env.JWT_PKEY
      let token = socket.handshake.query.token

      jwt.verify(token, pkey, options, (err, decodedToken) => {
        if (err) {
          console.error(err)
          return next(new Error(err))
        } else {
          currentConnections[socket.id] = {
            socket,
            role: null,
            token: decodedToken,
          };

          return next()
        }
      })
    })

    io.on('connection', (client) => {
      const adaptors = { connection, client };

      client.on('cleanDatabase', (ackCallback) => {
        cleanDatabase({
          connection,
          ackCallback
        })
      })

      client.on('getAllEditionMetadataForLesson', (lessonID) => {
        getAllEditionMetadataForLesson({
          connection,
          client,
          lessonID
        })
      })

      client.on('teacherConnected', (classroomActivityId) => {
        teacherConnected({
          connection,
          classroomActivityId,
          client,
        })
      });

      client.on('disconnect', () => {
        disconnect({
          connection,
          client,
        })
      });

      client.on('subscribeToClassroomLessonSession', (classroomLessonSessionId) => {
        subscribeToClassroomLessonSession({
          connection,
          client,
          classroomLessonSessionId,
        });
      });

      client.on('createPreviewSession', (previewSessionData) => {
        createPreviewSession({
          connection,
          previewSessionData,
        });
      });

      client.on('updateClassroomLessonSession', (session) => {
        updateClassroomLessonSession({
          session,
          connection
        });
      });

      client.on('createOrUpdateClassroomLessonSession', (classroomActivityId, teacherIdObject) => {
        createOrUpdateClassroomLessonSession({
          connection,
          classroomActivityId,
          teacherIdObject,
          client
        });
      });

      client.on('setSlideStartTime', (classroomActivityId, questionId) => {
        setSlideStartTime({
          connection,
          classroomActivityId,
          questionId,
        });
      });

      client.on('registerPresence', (classroomActivityId, studentId) => {
        registerPresence({
          connection,
          client,
          classroomActivityId,
          studentId,
        })
      });

      client.on('addStudent', (classroomActivityId, studentName) => {
        addStudent({
          connection,
          client,
          classroomActivityId,
          studentName,
        });
      });

      client.on('saveStudentSubmission', (classroomActivityId, questionId, studentId, submission) => {
        saveStudentSubmission({
          classroomActivityId,
          connection,
          questionId,
          studentId,
          submission,
        });
      });

      client.on('removeStudentSubmission', (classroomActivityId, questionId, studentId) => {
        removeStudentSubmission({
          classroomActivityId,
          connection,
          questionId,
          studentId,
        });
      });

      client.on('removeMode', (classroomActivityId, questionId) => {
        removeMode({
          connection,
          classroomActivityId,
          questionId,
        });
      })

      client.on('clearAllSelectedSubmissions', (classroomActivityId, questionId) => {
        clearAllSelectedSubmissions({
          connection,
          classroomActivityId,
          questionId,
        });
      })

      client.on('clearAllSubmissions', (classroomActivityId, questionId) => {
        clearAllSubmissions({
          connection,
          classroomActivityId,
          questionId,
        });
      })

      client.on('saveSelectedStudentSubmission', (classroomActivityId, questionId, studentId) => {
        saveSelectedStudentSubmission({
          classroomActivityId,
          questionId,
          studentId,
          connection,
        });
      })

      client.on('updateStudentSubmissionOrder', (classroomActivityId, questionId, studentId) => {
        updateStudentSubmissionOrder({
          classroomActivityId,
          questionId,
          studentId,
          connection,
        });
      })

      client.on('removeSelectedStudentSubmission', (classroomActivityId, questionId, studentId) => {
        removeSelectedStudentSubmission({
          classroomActivityId,
          questionId,
          studentId,
          connection,
        });
      })

      client.on('setMode', (classroomActivityId, questionId, mode) => {
        setMode({
          classroomActivityId,
          questionId,
          mode,
          connection,
        });
      })

      client.on('setModel', (classroomActivityId, questionId, model) => {
        setModel({
          classroomActivityId,
          questionId,
          model,
          connection,
        });
      })

      client.on('setPrompt', (classroomActivityId, questionId, prompt) => {
        setPrompt({
          classroomActivityId,
          questionId,
          prompt,
          connection,
        });
      })

      client.on('toggleStudentFlag', (classroomActivityId, studentId) => {
        toggleStudentFlag({
          classroomActivityId,
          studentId,
          connection,
        });
      })

      client.on('setWatchTeacherState', (classroomActivityId) => {
        setWatchTeacherState({
          classroomActivityId,
          connection,
        });
      })

      client.on('removeWatchTeacherState', (classroomActivityId) => {
        removeWatchTeacherState({
          classroomActivityId,
          connection,
        });
      })

      client.on('addStudents', (classroomActivityId, activitySessions, studentIds) => {
        addStudents({
          classroomActivityId,
          activitySessions,
          studentIds,
          connection,
        });
      })

      client.on('redirectAssignedStudents', (classroomActivityId, followUpOption, followUpUrl) => {
        redirectAssignedStudents({
          classroomActivityId,
          followUpOption,
          followUpUrl,
          connection,
        });
      })

      client.on('setClassroomName', (classroomActivityId, classroomName) => {
        setClassroomName({
          classroomActivityId,
          classroomName,
          connection,
        });
      })

      client.on('setTeacherName', (classroomActivityId, teacherName) => {
        setTeacherName({
          classroomActivityId,
          teacherName,
          connection,
        });
      })

      client.on('addFollowUpName', (classroomActivityId, followUpActivityName) => {
        addFollowUpName({
          classroomActivityId,
          followUpActivityName,
          connection,
        });
      })

      client.on('addSupportingInfo', (classroomActivityId, supportingInfo) => {
        addSupportingInfo({
          classroomActivityId,
          supportingInfo,
          connection,
        });
      })

      client.on('saveReview', (classroomActivityId, activityId, value) => {
        saveReview({
          classroomActivityId,
          activityId,
          value,
          connection,
        })
      })

      client.on('subscribeToClassroomLesson', (data) => {
        subscribeToClassroomLesson({ ...adaptors, ...data })
      })

      client.on('getAllClassroomLessons', () => {
        getAllClassroomLessons({ ...adaptors })
      })

      client.on('createOrUpdateClassroomLesson', (data) => {
        createOrUpdateClassroomLesson({ ...adaptors, ...data });
      })

      client.on('deleteClassroomLesson', (data) => {
        deleteClassroomLesson({ ...adaptors, ...data });
      })

      client.on('getAllClassroomLessonReviews', () => {
        getAllClassroomLessonReviews({ ...adaptors })
      })

      client.on('createOrUpdateReview', (review) => {
        createOrUpdateReview({
          connection,
          review,
        })
      })

      client.on('getAllEditionMetadata', () => {
        getAllEditionMetadata({
          connection,
          client
        })
      })

      client.on('getAllEditionMetadataForLesson', (lessonID) => {
        getAllEditionMetadataForLesson({
          connection,
          client,
          lessonID
        })
      })

      client.on('getEditionQuestions', (editionID) => {
        getEditionQuestions({
          connection,
          client,
          editionID
        })
      })

      client.on('updateEditionMetadata', (data) => {
        updateEditionMetadata({ ...adaptors, ...data })
      })

      client.on('setEditionId', (classroomActivityId, editionId) => {
        setEditionId({
          classroomActivityId,
          editionId,
          connection,
          client,
        });
      })

      client.on('deleteEdition', (data) => {
        deleteEdition({ ...adaptors, ...data });
      })

      client.on('updateEditionSlides', (data) => {
        updateEditionSlides({ ...adaptors, ...data });
      })

      client.on('updateSlideScriptItems', (data) => {
        updateSlideScriptItems({ ...adaptors, ...data });
      })

      client.on('saveEditionSlide', (data) => {
        saveEditionSlide({ ...adaptors, ...data });
      })

      client.on('saveEditionScriptItem', (data) => {
        saveEditionScriptItem({ ...adaptors, ...data });
      })

      client.on('deleteScriptItem', (data) => {
        deleteScriptItem({ ...adaptors, ...data });
      })

      client.on('addScriptItem', (data) => {
        addScriptItem({ ...adaptors, ...data });
      })

      client.on('deleteEditionSlide', (data) => {
        deleteEditionSlide({ ...adaptors, ...data });
      })

      client.on('addSlide', (data) => {
        addSlide({ ...adaptors, ...data });
      })

      client.on('setTeacherModels', (classroomActivityId, editionId) => {
        setTeacherModels({
          classroomActivityId,
          editionId,
          connection,
        })
      })

      client.on('createNewEdition', (editionData, questions) => {
        createNewEdition({
          editionData,
          connection,
          client,
          questions
        })
      })

      client.on('publishEdition', (editionMetadata, editionQuestions) => {
        publishEdition({
          editionMetadata,
          editionQuestions,
          connection,
          client
        })
      })

      client.on('archiveEdition', (editionUID) => {
        archiveEdition({
          editionUID,
          connection,
          client
        })
      })
    })
  }
});

app.listen(port);
console.log('listening on port ', port);
