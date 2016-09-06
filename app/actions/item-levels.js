var C = require("../constants").default
import rootRef from "../libs/firebase"
var	levelsRef = rootRef.child("item-levels")
import { push } from 'react-router-redux'


module.exports = {
	// called when the app starts. this means we immediately download all quotes, and
	// then receive all quotes again as soon as anyone changes anything.
	startListeningToItemLevels: function(){
		return function(dispatch,getState){
			levelsRef.on("value",function(snapshot){
				dispatch({ type: C.RECEIVE_ITEM_LEVELS_DATA, data: snapshot.val() });
			});
		}
	},
	loadItemLevels: function(){
		return function(dispatch,getState){
			levelsRef.once("value",function(snapshot){
				dispatch({ type: C.RECEIVE_ITEM_LEVELS_DATA, data: snapshot.val() });
			});
		}
	},
	startItemLevelEdit: function(lid){
		return {type:C.START_ITEM_LEVEL_EDIT,lid};
	},
	cancelItemLevelEdit: function(lid){
		return {type:C.FINISH_ITEM_LEVEL_EDIT,lid};
	},
	deleteItemLevel: function(lid){
		return function(dispatch,getState){
			dispatch({type:C.SUBMIT_ITEM_LEVEL_EDIT,lid});
			levelsRef.child(lid).remove(function(error){
				dispatch({type:C.FINISH_ITEM_LEVEL_EDIT,lid});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Deletion failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Item Level successfully deleted!"});
				}
			});
		};
	},
	submitItemLevelEdit: function(lid,content){
		return function(dispatch,getState){
				dispatch({type:C.SUBMIT_ITEM_LEVEL_EDIT,lid});
				levelsRef.child(lid).set(content,function(error){
					dispatch({type:C.FINISH_ITEM_LEVEL_EDIT,lid});
					if (error){
						dispatch({type:C.DISPLAY_ERROR,error:"Update failed! "+error});
					} else {
						dispatch({type:C.DISPLAY_MESSAGE,message:"Update successfully saved!"});
					}
				});
		};
	},
  toggleNewItemLevelModal: function(){
    return {type:C.TOGGLE_NEW_ITEM_LEVEL_MODAL}
  },
	submitNewItemLevel: function(content){
		return function(dispatch,getState){
			dispatch({type:C.AWAIT_NEW_ITEM_LEVEL_RESPONSE});
			var newRef = levelsRef.push(content,function(error){
				dispatch({type:C.RECEIVE_NEW_ITEM_LEVEL_RESPONSE});
				if (error){
					dispatch({type:C.DISPLAY_ERROR,error:"Submission failed! "+error});
				} else {
					dispatch({type:C.DISPLAY_MESSAGE,message:"Submission successfully saved!"});
          var action = push('/admin/item-levels/' + newRef.key);
          dispatch(action)
				}
			});
		}
	}
};
