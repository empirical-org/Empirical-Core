var C = require("../constants").default
// import rootRef from "../libs/firebase"
import request from 'request'
import _ from 'underscore'
var	conceptsEndpoint = 'https://staging.quill.org/api/v1/concepts.json'
import { push } from 'react-router-redux'

function splitInLevels (concepts) {
	return _.groupBy(concepts, 'level');
}


module.exports = {
	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
	startListeningToConcepts: function(){
		return function(dispatch,getState){
			request(conceptsEndpoint, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    // console.log(body) // Show the HTML for the Google homepage.
					// console.log(JSON.parse(body));
					dispatch({ type: C.RECEIVE_CONCEPTS_DATA, data: splitInLevels(JSON.parse(body).concepts) });
			  }
			})
			// conceptsRef.on("value",function(snapshot){
			// 	dispatch({ type: C.RECEIVE_CONCEPTS_DATA, data: snapshot.val() });
			// });
		}
	},
	// startConceptEdit: function(cid){
	// 	return {type:C.START_CONCEPT_EDIT,cid};
	// },
	// cancelConceptEdit: function(cid){
	// 	return {type:C.FINISH_CONCEPT_EDIT,cid};
	// },
	// deleteConcept: function(cid){
	// 	return function(dispatch,getState){
	// 		dispatch({type:C.SUBMIT_CONCEPT_EDIT,cid});
	// 		conceptsRef.child(cid).remove(function(error){
	// 			dispatch({type:C.FINISH_CONCEPT_EDIT,cid});
	// 			if (error){
	// 				dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
	// 			} else {
	// 				dispatch({type:C.DISPLAY_MESSAGE,message:"Concept successfully deleted!"});
	// 			}
	// 		});
	// 	};
	// },
	// submitConceptEdit: function(cid,content){
	// 	return function(dispatch,getState){
	// 			dispatch({type:C.SUBMIT_CONCEPT_EDIT,cid});
	// 			conceptsRef.child(cid).set(content,function(error){
	// 				dispatch({type:C.FINISH_CONCEPT_EDIT,cid});
	// 				if (error){
	// 					dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
	// 				} else {
	// 					dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
	// 				}
	// 			});
	// 	};
	// },
  // toggleNewConceptModal: function(){
  //   return {type:C.TOGGLE_NEW_CONCEPT_MODAL}
  // },
	// submitNewConcept: function(content){
	// 	return function(dispatch,getState){
	// 		dispatch({type:C.AWAIT_NEW_CONCEPT_RESPONSE});
	// 		var newRef = conceptsRef.push(content,function(error){
	// 			dispatch({type:C.RECEIVE_NEW_CONCEPT_RESPONSE});
	// 			if (error){
	// 				dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
	// 			} else {
	// 				dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
  //         var action = push('/admin/concepts/' + newRef.key)
  //         dispatch(action)
	// 			}
	// 		});
	// 	}
	// }
};
