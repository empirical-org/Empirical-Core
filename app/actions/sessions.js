var C = require("../constants").default
import rootRef from '../libs/firebase';
const sessionsRef = rootRef.child('savedSessions');

export default {
  get: function(sessionID, cb){
    sessionsRef.child(sessionID).once("value", (snapshot) => {
      const session = snapshot.val()
      session.currentQuestion.question.attempts = [];
      cb(session)
    })
  },

  update: function(sessionID, session){
    sessionsRef.child(sessionID).set(session)
  },

  delete: function(sessionID){
    sessionsRef.child(sessionID).remove(session)
  },

}
