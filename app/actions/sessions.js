var C = require("../constants").default
import rootRef from '../libs/firebase';
const sessionsRef = rootRef.child('sessions');

export default {
  get: function(sessionID, cb){
    sessionsRef.child(sessionID).once("value", (snapshot) => {
      cb(snapshot.val())
    })
  },

  update: function(sessionId, session){
    sessionsRef.child(sessionID).set(session)
  },

  delete: function(sessionId){
    sessionsRef.child(sessionID).remove(session)
  },

}
