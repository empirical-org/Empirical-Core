var C = require("../constants").default
import rootRef from "../libs/firebase"
var	sentenceFragmentsRef = rootRef.child("sentenceFragments"),
moment = require('moment');
import _ from 'lodash'

module.exports = {
	// called when the app starts. this means we immediately download all sentenceFragments, and
	// then receive all sentenceFragments again as soon as anyone changes anything.
	startListeningToQuestions: function(){
		return function(dispatch,getState){
			sentenceFragmentsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val() });
			});
		}
	},
	startQuestionEdit: function(sfid){
		return {type:C.START_SENTENCE_FRAGMENT_EDIT,sfid};
	},
	cancelQuestionEdit: function(sfid){
		return {type:C.FINISH_SENTENCE_FRAGMENT_EDIT,sfid};
	},
	deleteQuestion: function(sfid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_SENTENCE_FRAGMENT_EDIT,sfid});
			sentenceFragmentsRef.child(sfid).remove(function(error){
				dispatch({type:C.FINISH_SENTENCE_FRAGMENT_EDIT,sfid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Question successfully deleted!"});
				}
			});
		};
	},
	submitQuestionEdit: function(sfid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_SENTENCE_FRAGMENT_EDIT,sfid});
				sentenceFragmentsRef.child(sfid).update(content,function(error){
					dispatch({type:C.FINISH_SENTENCE_FRAGMENT_EDIT,sfid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
	submitEditedFocusPoint: function(sfid, data, fpid) {
		return function(dispatch,getState){
				sentenceFragmentsRef.child(sfid + "/focusPoints/" + fpid).update(data,function(error){
						if (error) {
							alert("Submission failed! "+error);
						}
				});
		};
	},
  toggleNewQuestionModal: function(){
    return {type:C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL}
  },
	submitNewQuestion: function(content, response){
		return (dispatch,getState) => {
			dispatch({type:C.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE});
			var newRef = sentenceFragmentsRef.push(content, (error) => {
				dispatch({type:C.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(this.submitNewResponse(newRef.key, response))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
		}
	},
  submitNewResponse: function (sfid, content, prid) {
    content.createdAt = moment().format("x");
    return function (dispatch,getState) {
      dispatch({type:C.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE});
			var newRef = sentenceFragmentsRef.child(sfid).child('responses').push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(pathwaysActions.submitNewPathway(newRef.key, prid, sfid))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
    }
  },
	submitNewFocusPoint: function(sfid, data) {
		return function (dispatch, getState) {
			sentenceFragmentsRef.child(sfid + '/focusPoints').push(data, function(error){
				if (error) {
					alert("Submission failed! "+error)
				}
			});
		};
	},
  startResponseEdit: function(sfid,rid){
		return {type:C.START_RESPONSE_EDIT,sfid,rid};
	},
	cancelResponseEdit: function(sfid,rid){
		return {type:C.FINISH_RESPONSE_EDIT,sfid,rid};
	},
  startChildResponseView: function(sfid,rid){
		return {type:C.START_CHILD_RESPONSE_VIEW,sfid,rid};
	},
	cancelChildResponseView: function(sfid,rid){
		return {type:C.CANCEL_CHILD_RESPONSE_VIEW,sfid,rid};
	},
  startFromResponseView: function(sfid,rid){
		return {type:C.START_FROM_RESPONSE_VIEW,sfid,rid};
	},
	cancelFromResponseView: function(sfid,rid){
		return {type:C.CANCEL_FROM_RESPONSE_VIEW,sfid,rid};
	},
  startToResponseView: function(sfid,rid){
		return {type:C.START_TO_RESPONSE_VIEW,sfid,rid};
	},
	cancelToResponseView: function(sfid,rid){
		return {type:C.CANCEL_TO_RESPONSE_VIEW,sfid,rid};
	},
  submitResponseEdit: function(sfid,rid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_RESPONSE_EDIT,sfid,rid});
				sentenceFragmentsRef.child(sfid+ "/responses/" + rid).update(content,function(error){
					dispatch({type:C.FINISH_RESPONSE_EDIT,sfid,rid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  setUpdatedResponse: function(sfid,rid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_RESPONSE_EDIT,sfid,rid});
				sentenceFragmentsRef.child(sfid+ "/responses/" + rid).set(content,function(error){
					dispatch({type:C.FINISH_RESPONSE_EDIT,sfid,rid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  deleteResponse: function(sfid,rid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_RESPONSE_EDIT,sfid});
			sentenceFragmentsRef.child(sfid+ "/responses/" + rid).remove(function(error){
				dispatch({type:C.FINISH_RESPONSE_EDIT,sfid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					sentenceFragmentsRef.child(sfid).on("value", function(data) {
						const childResponseKeys = _.keys(data.val().responses).filter((key) => {
							return data.val().responses[key].parentID===rid
						})
						childResponseKeys.forEach((childKey) => {
							dispatch(module.exports.deleteResponse(sfid, childKey))
						})
					})

					dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
				}
			});
		};
  },
  incrementResponseCount: function(sfid, rid, prid) {
    return (dispatch, getState) => {
      var responseRef = sentenceFragmentsRef.child(sfid+ "/responses/" + rid)
      responseRef.child('/count').transaction(function(currentCount){
        return currentCount+1
      }, function(error){
        if (error){
          dispatch({type:C.DISPLAY_ERROR,error:"increment failed! "+error});
        } else {
          dispatch(pathwaysActions.submitNewPathway(rid, prid, sfid))
          dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully incremented!"});
        }
      })
      responseRef.child('parentID').once('value', (snap) => {
        if (snap.val()) {
          dispatch(this.incrementChildResponseCount(sfid, snap.val()))
        }
      })
    }
  },
  incrementChildResponseCount: function(sfid, rid) {
    return (dispatch, getState) => {
      sentenceFragmentsRef.child(sfid+ "/responses/" + rid + '/childCount').transaction(function(currentCount){
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
  removeLinkToParentID: function(sfid, rid) {
    return function(dispatch, getState){
      sentenceFragmentsRef.child(sfid+ "/responses/" + rid + '/parentID').remove(function(error){
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
				}
			});
    }
  }
};
