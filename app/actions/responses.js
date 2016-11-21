const C = require("../constants").default
import pathwaysActions from './pathways';
import rootRef from "../libs/firebase"
var	responsesRef = rootRef.child("responses")

export function deleteStatus(questionId) {
  return {type: C.DELETE_RESPONSE_STATUS, data: {questionId}}
}

export function loadResponseData(questionId) {
  return (dispatch, getState) => {
    dispatch(updateStatus(questionId, "LOADING"))
    responsesForQuestionRef(questionId).once("value", (snapshot) => {
      dispatch(updateData(questionId, snapshot.val()))
      dispatch(updateStatus(questionId, "LOADED"))
    })
  }
}

export function loadResponseDataAndListen(questionId) {
  return (dispatch, getState) => {
    dispatch(updateStatus(questionId, "LOADING"))
    responsesForQuestionRef(questionId).on("value", (snapshot) => {
      console.log("New Val recieved")
      dispatch(updateData(questionId, snapshot.val()))
      dispatch(updateStatus(questionId, "LOADED"))
    })
  }
}

export function stopListeningToResponses(questionId) {
  return (dispatch, getState) => {
    responsesForQuestionRef(questionId).off('value')
  }
}

export function updateStatus(questionId, status) {
  return {type: C.UPDATE_RESPONSE_STATUS, data: {questionId, status}}
}

export function updateData(questionId, responses) {
  return {type: C.UPDATE_RESPONSE_DATA, data: {questionId, responses}}
}

export function submitNewResponse (content, prid) {
    content.createdAt = moment().format("x");
    return function (dispatch,getState) {
      dispatch({type:C.AWAIT_NEW_QUESTION_RESPONSE});
			var newRef = responsesRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_QUESTION_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(pathwaysActions.submitNewPathway(newRef.key, prid, content.questionUID))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
    }
  }

export function deleteResponse (qid,rid){
	return function(dispatch,getState){
		responsesRef.child(rid).remove(function(error){
			if (error){
				dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
			} else {
				responsesForQuestionRef(qid).on("value", function(data) {
					const childResponseKeys = _.keys(data.val().responses).filter((key) => {
						return data.val().responses[key].parentID===rid
					})
					childResponseKeys.forEach((childKey) => {
						dispatch(module.exports.deleteResponse(qid, childKey))
					})
				})
				dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
			}
		});
	};
}

export function setUpdatedResponse (rid,content){
	return function(dispatch,getState){
			responseRef.child(rid).set(content,function(error){
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
				}
			});
	};
}

export function submitResponseEdit (rid, content){
  return function(dispatch,getState){
      responsesRef.child(rid).update(content,function(error){
        if (error){
          dispatch({type:C.DISPLAY_ERROR,error:"Update failed! " + error});
        } else {
          dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
        }
      });
  };
}

export function incrementResponseCount (qid, rid, prid) {
  return (dispatch, getState) => {
    console.log("Incrementing: ", qid, rid, prid)
    var responseRef = responsesRef.child(rid)
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
        dispatch(this.incrementChildResponseCount(snap.val()))
      }
    })
  }
}

export function incrementChildResponseCount(rid) {
  return (dispatch, getState) => {
    responsesRef.child(rid + '/childCount').transaction(function(currentCount){
      return currentCount+1
    }, function(error){
      if (error){
        dispatch({type:C.DISPLAY_ERROR,error:"increment failed! "+error});
      } else {
        dispatch({type:C.DISPLAY_MESSAGE,message:"Child Response successfully incremented!"});
      }
    })
  }
}

export function removeLinkToParentID (rid) {
  return function(dispatch, getState){
    responsesRef.child(rid + '/parentID').remove(function(error){
			if (error){
				dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
			} else {
				dispatch({type:C.DISPLAY_MESSAGE,message:"Response successfully deleted!"});
			}
		});
  }
}

export function submitNewConceptResult(qid, rid, data) {
	return function (dispatch, getState) {
		responsesRef.child(rid + '/conceptResults').push(data, function(error){
			if (error) {
				alert("Submission failed! "+error)
			}
		});
	};
}

export function deleteConceptResult(qid, rid, crid) {
	return function(dispatch, getState) {
		responsesRef.child(rid + '/conceptResults/' + crid).remove(function(error) {
			if(error) {
				alert("Delete failed! " + error)
			}
		})
	}
}

function responsesForQuestionRef(questionId) {
  return responsesRef.orderByChild('questionUID').equalTo(questionId)
}
