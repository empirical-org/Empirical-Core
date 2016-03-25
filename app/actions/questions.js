var C = require("../constants").default,
  Firebase = require("firebase"),
	questionsRef = new Firebase(C.FIREBASE).child("questions")

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
	startQuestionEdit: function(cid){
		return {type:C.START_QUESTION_EDIT,cid};
	},
	cancelQuestionEdit: function(cid){
		return {type:C.FINISH_QUESTION_EDIT,cid};
	},
	deleteQuestion: function(cid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_QUESTION_EDIT,cid});
			questionsRef.child(cid).remove(function(error){
				dispatch({type:C.FINISH_QUESTION_EDIT,cid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Question successfully deleted!"});
				}
			});
		};
	},
	submitQuestionEdit: function(cid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_QUESTION_EDIT,cid});
				questionsRef.child(cid).set(content,function(error){
					dispatch({type:C.FINISH_QUESTION_EDIT,cid});
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
	submitNewQuestion: function(content){
		return function(dispatch,getState){
			dispatch({type:C.AWAIT_NEW_QUESTION_RESPONSE});
			var newRef = questionsRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_QUESTION_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
          console.log('newRef: ',newRef)
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
				}
			});
		}
	}
};
