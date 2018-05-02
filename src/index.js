import r from 'rethinkdb'
import socketio from 'socket.io'
import fs from 'fs'
import http from 'http'
import path from 'path'
import rethinkdbConfig from './rethinkdbConfig'
const app = http.createServer(handler)
const io = socketio(app)
const port = process.env.PORT || 8000

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
  setEditionId
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
  r.tableList().run(connection)
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

r.connect(rethinkdbConfig).then((connection) => {
  io.on('connection', (client) => {
    currentConnections[client.id] = { socket: client, role: null };

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

    client.on('subscribeToClassroomLesson', (classroomLessonUID) => {
      subscribeToClassroomLesson({
        classroomLessonUID,
        connection,
        client
      })
    })

    client.on('getAllClassroomLessons', () => {
      getAllClassroomLessons({
        connection,
        client
      })
    })

    client.on('createOrUpdateClassroomLesson', (classroomLesson) => {
      createOrUpdateClassroomLesson({
        connection,
        classroomLesson,
        client
      })
    })

    client.on('deleteClassroomLesson', (classroomLessonID) => {
      deleteClassroomLesson({
        connection,
        classroomLessonID
      })
    })

    client.on('getAllClassroomLessonReviews', () => {
      getAllClassroomLessonReviews({
        connection,
        client
      })
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

    client.on('updateEditionMetadata', (editionMetadata) => {
      updateEditionMetadata({
        connection,
        editionMetadata,
        client
      })
    })

    client.on('setEditionId', (classroomActivityId, editionId) => {
      setEditionId({
        classroomActivityId,
        editionId,
        connection,
        client,
      });
    })

    client.on('deleteEdition', (editionId) => {
      deleteEdition({
        editionId,
        connection,
        client
      })
    })

    client.on('updateEditionSlides', (editionId, slides) => {
      updateEditionSlides({
        editionId,
        slides,
        connection,
      });
    })

    client.on('updateSlideScriptItems', (editionId, slideId, scriptItems) => {
      updateSlideScriptItems({
        editionId,
        slideId,
        scriptItems,
        connection,
      });
    })

    client.on('saveEditionSlide', (editionId, slideId, slideData) => {
      saveEditionSlide({
        editionId,
        slideId,
        slideData,
        connection,
        client,
      });
    })

    client.on('saveEditionScriptItem', (editionId, slideId, scriptItemId,scriptItem) => {
      saveEditionScriptItem({
        editionId,
        slideId,
        scriptItemId,
        scriptItem,
        connection,
        client,
      });
    })

    client.on('deleteScriptItem', (editionId, slideId, script) => {
      deleteScriptItem({
        editionId,
        slideId,
        script,
        connection,
      });
    })

    client.on('addScriptItem', (editionId, slideId, slide) => {
      addScriptItem({
        editionId,
        slideId,
        slide,
        connection,
        client
      });
    })

    client.on('deleteEditionSlide', (editionId, slides) => {
      deleteEditionSlide({
        editionId,
        slides,
        connection,
      });
    })

    client.on('addSlide', (editionId, newEdition) => {
      addSlide({
        editionId,
        newEdition,
        connection,
        client,
      });
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

    client.on('deleteEdition', (editionUID) => {
      deleteEdition({
        editionUID,
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
});

app.listen(port);
console.log('listening on port ', port);
