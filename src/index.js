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
} from './handlers/sessions'

import {
  getAllClassroomLessonReviews,
  createOrUpdateReview,
} from './handlers/reviews'

import {
  subscribeToClassroomLesson,
  getAllClassroomLessons,
  createOrUpdateClassroomLesson,
  deleteClassroomLesson,
} from './handlers/lessons'

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
} from './handlers/editions'

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

      client.on('cleanDatabase', (data) => {
        cleanDatabase({ ...adaptors, ...data });
      })

      client.on('getAllEditionMetadataForLesson', (data) => {
        getAllEditionMetadataForLesson({ ...adaptors, ...data });
      })

      client.on('teacherConnected', (data) => {
        teacherConnected({ ...adaptors, ...data });
      });

      client.on('disconnect', () => {
        disconnect({ ...adaptors });
      });

      client.on('subscribeToClassroomLessonSession', (data) => {
        subscribeToClassroomLessonSession({ ...adaptors, ...data });
      });

      client.on('createPreviewSession', (data) => {
        createPreviewSession({ ...adaptors, ...data });
      });

      client.on('updateClassroomLessonSession', (data) => {
        updateClassroomLessonSession({ ...adaptors, ...data });
      });

      client.on('createOrUpdateClassroomLessonSession', (data) => {
        createOrUpdateClassroomLessonSession({ ...adaptors, ...data });
      });

      client.on('setSlideStartTime', (data) => {
        setSlideStartTime({ ...adaptors, ...data });
      });

      client.on('registerPresence', (data) => {
        registerPresence({ ...adaptors, ...data });
      });

      client.on('addStudent', (data) => {
        addStudent({ ...adaptors, ...data });
      });

      client.on('saveStudentSubmission', (data) => {
        saveStudentSubmission({ ...adaptors, ...data });
      });

      client.on('removeStudentSubmission', (data) => {
        removeStudentSubmission({ ...adaptors, ...data });
      });

      client.on('removeMode', (data) => {
        removeMode({ ...adaptors, ...data });
      })

      client.on('clearAllSelectedSubmissions', (data) => {
        clearAllSelectedSubmissions({ ...adaptors, ...data });
      })

      client.on('clearAllSubmissions', (data) => {
        clearAllSubmissions({ ...adaptors, ...data });
      })

      client.on('saveSelectedStudentSubmission', (data) => {
        saveSelectedStudentSubmission({ ...adaptors, ...data });
      })

      client.on('updateStudentSubmissionOrder', (data) => {
        updateStudentSubmissionOrder({ ...adaptors, ...data });
      })

      client.on('removeSelectedStudentSubmission', (data) => {
        removeSelectedStudentSubmission({ ...adaptors, ...data });
      })

      client.on('setMode', (data) => {
        setMode({ ...adaptors, ...data });
      })

      client.on('setModel', (data) => {
        setModel({ ...adaptors, ...data });
      })

      client.on('setPrompt', (data) => {
        setPrompt({ ...adaptors, ...data });
      })

      client.on('toggleStudentFlag', (data) => {
        toggleStudentFlag({ ...adaptors, ...data });
      })

      client.on('setWatchTeacherState', (data) => {
        setWatchTeacherState({ ...adaptors, ...data });
      })

      client.on('removeWatchTeacherState', (data) => {
        removeWatchTeacherState({ ...adaptors, ...data });
      })

      client.on('addStudents', (data) => {
        addStudents({ ...adaptors, ...data });
      })

      client.on('redirectAssignedStudents', (data) => {
        redirectAssignedStudents({ ...adaptors, ...data });
      })

      client.on('setClassroomName', (data) => {
        setClassroomName({ ...adaptors, ...data });
      })

      client.on('setTeacherName', (data) => {
        setTeacherName({ ...adaptors, ...data });
      })

      client.on('addFollowUpName', (data) => {
        addFollowUpName({ ...adaptors, ...data });
      })

      client.on('addSupportingInfo', (data) => {
        addSupportingInfo({ ...adaptors, ...data });
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

      client.on('createOrUpdateReview', (data) => {
        createOrUpdateReview({ ...adaptors, ...data });
      })

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
        updateEditionMetadata({ ...adaptors, ...data })
      })

      client.on('setEditionId', (data) => {
        setEditionId({ ...adaptors, ...data });
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

      client.on('setTeacherModels', (data) => {
        setTeacherModels({ ...adaptors, ...data });
      })

      client.on('createNewEdition', (data) => {
        createNewEdition({ ...adaptors, ...data });
      })

      client.on('publishEdition', (data) => {
        publishEdition({ ...adaptors, ...data });
      })

      client.on('archiveEdition', (data) => {
        archiveEdition({ ...adaptors, ...data });
      })
    })
  }
});

app.listen(port);
console.log('listening on port ', port);
