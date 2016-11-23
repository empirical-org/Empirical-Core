var C = require("../constants").default
import rootRef from "../libs/firebase"
var	diagnosticQuestionsRef = rootRef.child("diagnosticQuestions"),
moment = require('moment');
import _ from 'lodash'
import { push } from 'react-router-redux'
import pathwaysActions from './pathways';

module.exports = {
	// called when the app starts. this means we immediately download all diagnosticQuestions, and
	// then receive all diagnosticQuestions again as soon as anyone changes anything.
	startListeningToDiagnosticQuestions: function(){
		return function(dispatch,getState){
			diagnosticQuestionsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA, data: snapshot.val() });
			});
		}
	},
	loadDiagnosticQuestions: function(){
		return function(dispatch,getState){
			diagnosticQuestionsRef.once("value",function(snapshot){
				dispatch({ type: C.RECEIVE_DIAGNOSTIC_QUESTIONS_DATA, data: snapshot.val() });
			});
		}
	},
	startQuestionEdit: function(qid){
		return {type:C.START_DIAGNOSTIC_QUESTION_EDIT,qid};
	},
	cancelQuestionEdit: function(qid){
		return {type:C.FINISH_DIAGNOSTIC_QUESTION_EDIT,qid};
	},
	deleteQuestion: function(qid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_DIAGNOSTIC_QUESTION_EDIT,qid});
			diagnosticQuestionsRef.child(qid).remove(function(error){
				dispatch({type:C.FINISH_DIAGNOSTIC_QUESTION_EDIT,qid});
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
				dispatch({type:C.SUBMIT_DIAGNOSTIC_QUESTION_EDIT,qid});
				diagnosticQuestionsRef.child(qid).update(content,function(error){
					dispatch({type:C.FINISH_DIAGNOSTIC_QUESTION_EDIT,qid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
	submitEditedFocusPoint: function(qid, data, fpid) {
		return function(dispatch,getState){
				diagnosticQuestionsRef.child(qid + "/focusPoints/" + fpid).update(data,function(error){
						if (error) {
							alert("Submission failed! "+error);
						}
				});
		};
	},
  toggleNewQuestionModal: function(){
    return {type:C.TOGGLE_NEW_DIAGNOSTIC_QUESTION_MODAL}
  },
	submitNewQuestion: function(content, response){
		return (dispatch,getState) => {
			dispatch({type:C.AWAIT_NEW_DIAGNOSTIC_QUESTION_RESPONSE});
			var newRef = diagnosticQuestionsRef.push(content, (error) => {
				dispatch({type:C.RECEIVE_NEW_DIAGNOSTIC_QUESTION_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(this.submitNewResponse(newRef.key, response))
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
					var action = push('/admin/diagnosticQuestions/' + newRef.key)
          dispatch(action)
				}
			});
		}
	},
	submitNewFocusPoint: function(qid, data) {
		return function (dispatch, getState) {
			diagnosticQuestionsRef.child(qid + '/focusPoints').push(data, function(error){
				if (error) {
					alert("Submission failed! "+error)
				}
			});
		};
	},
  startResponseEdit: function(qid,rid){
		return {type:C.START_DIAGNOSTIC_RESPONSE_EDIT,qid,rid};
	},
	cancelResponseEdit: function(qid,rid){
		return {type:C.FINISH_DIAGNOSTIC_RESPONSE_EDIT,qid,rid};
	},
  startChildResponseView: function(qid,rid){
		return {type:C.START_CHILD_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	},
	cancelChildResponseView: function(qid,rid){
		return {type:C.CANCEL_CHILD_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	},
  startFromResponseView: function(qid,rid){
		return {type:C.START_FROM_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	},
	cancelFromResponseView: function(qid,rid){
		return {type:C.CANCEL_FROM_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	},
  startToResponseView: function(qid,rid){
		return {type:C.START_TO_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	},
	cancelToResponseView: function(qid,rid){
		return {type:C.CANCEL_TO_DIAGNOSTIC_RESPONSE_VIEW,qid,rid};
	}
};
