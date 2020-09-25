var C = require("../constants").default

import rootRef from "../libs/firebase"

var	pathwaysRef = rootRef.child("pathways")
import { push } from 'react-router-redux'

export default {
  startListeningToPathways: function(){
		return function(dispatch,getState){
			pathwaysRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_PATHWAYS_DATA, data: snapshot.val() });
			});
		}
	},
	loadPathways: function(){
		return function(dispatch,getState){
			pathwaysRef.once("value",function(snapshot){
				dispatch({ type: C.RECEIVE_PATHWAYS_DATA, data: snapshot.val() });
			});
		}
	},
  submitNewPathway: function(rid, prid, qid){
		return function(dispatch,getState){
			dispatch({type:C.AWAIT_NEW_PATHWAY_RESPONSE});
      var content = {
        toResponseID: rid,
        questionID: qid
      }
      if (prid) {
        content.fromResponseID = prid
      }
			var newRef = pathwaysRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_PATHWAY_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
		}
	}
}
