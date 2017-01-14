var C = require("../constants").default
import rootRef from '../libs/firebase';
const sessionsRef = rootRef.child('savedSessions');

export default {
  get: function(sessionID, cb){
    sessionsRef.child(sessionID).once("value", (snapshot) => {
      if (snapshot.exists()) {
        const session = snapshot.val();
        if (session.currentQuestion.question) {
          session.currentQuestion.question.attempts = [];
        } else {
          session.currentQuestion.data.attempts = [];
        }
        cb(session);
      }
    })
  },

  update: function(sessionID, session){
    sessionsRef.child(sessionID).set(session)
  },

  delete: function(sessionID){
    sessionsRef.child(sessionID).remove(session)
  },

}
