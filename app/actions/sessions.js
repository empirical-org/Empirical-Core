var C = require("../constants").default


export default {
  update: function(sessionId, session){
    return {type: C.UPDATE_SESSION_DATA, data: {sessionId, session}}
  },

  delete: function(sessionId){
    return {type: C.DELETE_SESSION_DATA, data: {sessionId}}
  },

  deleteAll: function(){
    return {type: C.DELETE_ALL_SESSION_DATA, data: {}}
  },

}
