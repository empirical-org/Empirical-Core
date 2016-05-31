var C = require("../constants").default
import rootRef from "../libs/firebase"
console.log(rootRef);
var	questionsRef = rootRef.child("questions"),
	moment = require('moment');

import pathwaysActions from './pathways';

module.exports = {
	// called when the app starts. this means we immediately download all questions, and
	// then receive all questions again as soon as anyone changes anything.
	startListeningToQuestions: function(){
		return function(dispatch,getState){
			questionsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_QUESTIONS_DATA, data: snapshot.val() });
			});
		}
	},
	startQuestionEdit: function(qid){
		return {type:C.START_QUESTION_EDIT,qid};
	},
	cancelQuestionEdit: function(qid){
		return {type:C.FINISH_QUESTION_EDIT,qid};
	},
	deleteQuestion: function(qid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_QUESTION_EDIT,qid});
			questionsRef.child(qid).remove(function(error){
				dispatch({type:C.FINISH_QUESTION_EDIT,qid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Question successfully deleted!"});
				}
			});
		};
	},
	submitQuestionEdit: function(qid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_QUESTION_EDIT,qid});
				questionsRef.child(qid).update(content,function(error){
					dispatch({type:C.FINISH_QUESTION_EDIT,qid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  toggleNewQuestionModal: function(){
    return {type:C.TOGGLE_NEW_QUESTION_MODAL}
  },
	submitNewQuestion: function(content, response){
		return (dispatch,getState) => {
			dispatch({type:C.AWAIT_NEW_QUESTION_RESPONSE});
			var newRef = questionsRef.push(content, (error) => {
				dispatch({type:C.RECEIVE_NEW_QUESTION_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(this.submitNewResponse(newRef.key(), response))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
		}
	},
  submitNewResponse: function (qid, content, prid) {
    content.createdAt = moment().format("x");
    return function (dispatch,getState) {
      dispatch({type:C.AWAIT_NEW_QUESTION_RESPONSE});
			var newRef = questionsRef.child(qid).child('responses').push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_QUESTION_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(pathwaysActions.submitNewPathway(newRef.key(), prid, qid))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
    }
  },
  startResponseEdit: function(qid,rid){
		return {type:C.START_RESPONSE_EDIT,qid,rid};
	},
	cancelResponseEdit: function(qid,rid){
		return {type:C.FINISH_RESPONSE_EDIT,qid,rid};
	},
  startChildResponseView: function(qid,rid){
		return {type:C.START_CHILD_RESPONSE_VIEW,qid,rid};
	},
	cancelChildResponseView: function(qid,rid){
		return {type:C.CANCEL_CHILD_RESPONSE_VIEW,qid,rid};
	},
  startFromResponseView: function(qid,rid){
		return {type:C.START_FROM_RESPONSE_VIEW,qid,rid};
	},
	cancelFromResponseView: function(qid,rid){
		return {type:C.CANCEL_FROM_RESPONSE_VIEW,qid,rid};
	},
  startToResponseView: function(qid,rid){
		return {type:C.START_TO_RESPONSE_VIEW,qid,rid};
	},
	cancelToResponseView: function(qid,rid){
		return {type:C.CANCEL_TO_RESPONSE_VIEW,qid,rid};
	},
  submitResponseEdit: function(qid,rid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_RESPONSE_EDIT,qid,rid});
				questionsRef.child(qid+ "/responses/" + rid).update(content,function(error){
					dispatch({type:C.FINISH_RESPONSE_EDIT,qid,rid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  setUpdatedResponse: function(qid,rid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_RESPONSE_EDIT,qid,rid});
				questionsRef.child(qid+ "/responses/" + rid).set(content,function(error){
					dispatch({type:C.FINISH_RESPONSE_EDIT,qid,rid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  deleteResponse: function(qid,rid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_RESPONSE_EDIT,qid});
			questionsRef.child(qid+ "/responses/" + rid).remove(function(error){
				dispatch({type:C.FINISH_RESPONSE_EDIT,qid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
				}
			});
		};
  },
  incrementResponseCount: function(qid, rid, prid) {
    return (dispatch, getState) => {
      var responseRef = questionsRef.child(qid+ "/responses/" + rid)
      responseRef.child('/count').transaction(function(currentCount){
        return currentCount+1
      }, function(error){
        if (error){
          dispatch({type:C.DISPLAY_ERROR,error:"increment failed! "+error});
        } else {
          dispatch(pathwaysActions.submitNewPathway(rid, prid, qid))
          dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully incremented!"});
        }
      })
      responseRef.child('parentID').once('value', (snap) => {
        if (snap.val()) {
          dispatch(this.incrementChildResponseCount(qid, snap.val()))
        }
      })
    }
  },
  incrementChildResponseCount: function(qid, rid) {
    return (dispatch, getState) => {
      questionsRef.child(qid+ "/responses/" + rid + '/childCount').transaction(function(currentCount){
        return currentCount+1
      }, function(error){
        if (error){
          dispatch({type:C.DISPLAY_ERROR,error:"increment failed! "+error});
        } else {
          dispatch({type:C.DISPLAY_MESSAGE,message:"Child Response successfully incremented!"});
        }
      })
    }
  },
  removeLinkToParentID: function(qid, rid) {
    return function(dispatch, getState){
      questionsRef.child(qid+ "/responses/" + rid + '/parentID').remove(function(error){
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
				}
			});
    }
  }
};
