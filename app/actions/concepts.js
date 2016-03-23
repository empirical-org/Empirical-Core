var C = require("../constants").default,
  Firebase = require("firebase"),
	conceptsRef = new Firebase(C.FIREBASE).child("concepts")

module.exports = {
	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
	startListeningToConcepts: function(){
		return function(dispatch,getState){
			conceptsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_CONCEPTS_DATA, data: snapshot.val() });
			});
		}
	},
	startConceptEdit: function(cid){
		return {type:C.START_CONCEPT_EDIT,cid};
	},
	cancelConceptEdit: function(cid){
		return {type:C.FINISH_CONCEPT_EDIT,cid};
	},
	deleteConcept: function(cid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_CONCEPT_EDIT,cid});
			conceptsRef.child(cid).remove(function(error){
				dispatch({type:C.FINISH_CONCEPT_EDIT,cid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Concept successfully deleted!"});
				}
			});
		};
	},
	submitConceptEdit: function(cid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_CONCEPT_EDIT,cid});
				conceptsRef.child(cid).set(content,function(error){
					dispatch({type:C.FINISH_CONCEPT_EDIT,cid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
	submitNewConcept: function(content){
		return function(dispatch,getState){
			dispatch({type:C.AWAIT_NEW_CONCEPT_RESPONSE});
			conceptsRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_CONCEPT_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
		}
	}
};
