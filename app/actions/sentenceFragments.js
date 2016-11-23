var C = require("../constants").default
import pathwaysActions from './pathways.js';
import rootRef from "../libs/firebase"
var	sentenceFragmentsRef = rootRef.child("sentenceFragments"),
moment = require('moment');
import _ from 'lodash'

module.exports = {
	// called when the app starts. this means we immediately download all sentenceFragments, and
	// then receive all sentenceFragments again as soon as anyone changes anything.
	startListeningToSentenceFragments: function(){
		return function(dispatch,getState){
			sentenceFragmentsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val() });
			});
		}
	},
	loadSentenceFragments: function(){
		return function(dispatch,getState){
			sentenceFragmentsRef.once("value",function(snapshot){
				dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: snapshot.val() });
			});
		}
	},
	startSentenceFragmentEdit: function(sfid){
		return {type:C.START_SENTENCE_FRAGMENT_EDIT,sfid};
	},
	cancelSentenceFragmentEdit: function(sfid){
		return {type:C.FINISH_SENTENCE_FRAGMENT_EDIT,sfid};
	},
	deleteSentenceFragment: function(sfid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_SENTENCE_FRAGMENT_EDIT,sfid});
			sentenceFragmentsRef.child(sfid).remove(function(error){
				dispatch({type:C.FINISH_SENTENCE_FRAGMENT_EDIT,sfid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"SentenceFeedback successfully deleted!"});
				}
			});
		};
	},
	submitSentenceFragmentEdit: function(sfid,content){
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
  toggleNewSentenceFeedbackModal: function(){
    return {type:C.TOGGLE_NEW_SENTENCE_FRAGMENT_MODAL}
  },
	submitNewSentenceFragment: function(content, response){
		return (dispatch,getState) => {
			dispatch({type:C.AWAIT_NEW_SENTENCE_FRAGMENT_RESPONSE});
			var newRef = sentenceFragmentsRef.push(content, (error) => {
				dispatch({type:C.RECEIVE_NEW_SENTENCE_FRAGMENT_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          dispatch(this.submitNewResponse(newRef.key, response));
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
	submitNewConceptResult: function(sfid, rid, data) {
		return function (dispatch, getState) {
			sentenceFragmentsRef.child(sfid + '/responses/' + rid + '/conceptResults').push(data, function(error){
				if (error) {
					alert("Submission failed! "+error)
				}
			});
		};
	},
	deleteConceptResult: function(sfid, rid, crid) {
		return function(dispatch, getState) {
			sentenceFragmentsRef.child(sfid + '/responses/' + rid + '/conceptResults/' + crid).remove(function(error) {
				if(error) {
					alert("Delete failed! " + error)
				}
			})
		}
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
};
