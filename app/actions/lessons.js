var C = require("../constants").default
import rootRef from "../libs/firebase"
var	lessonsRef = rootRef.child("lessons")
import { push } from 'react-router-redux'


module.exports = {
	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
	startListeningToLessons: function(){
		return function(dispatch,getState){
			lessonsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_LESSONS_DATA, data: snapshot.val() });
			});
		}
	},
	startLessonEdit: function(cid){
		return {type:C.START_LESSON_EDIT,cid};
	},
	cancelLessonEdit: function(cid){
		return {type:C.FINISH_LESSON_EDIT,cid};
	},
	deleteLesson: function(cid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_LESSON_EDIT,cid});
			lessonsRef.child(cid).remove(function(error){
				dispatch({type:C.FINISH_LESSON_EDIT,cid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Lesson successfully deleted!"});
				}
			});
		};
	},
	submitLessonEdit: function(cid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_LESSON_EDIT,cid});
				lessonsRef.child(cid).set(content,function(error){
					dispatch({type:C.FINISH_LESSON_EDIT,cid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  toggleNewLessonModal: function(){
    return {type:C.TOGGLE_NEW_LESSON_MODAL}
  },
	submitNewLesson: function(content){
		return function(dispatch,getState){
			dispatch({type:C.AWAIT_NEW_LESSON_RESPONSE});
			var newRef = lessonsRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_LESSON_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
          var action = push('/admin/lessons/' + newRef.key)
          dispatch(action)
				}
			});
		}
	}
};
