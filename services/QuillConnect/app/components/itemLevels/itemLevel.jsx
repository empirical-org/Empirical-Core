import React from 'react'
import {connect} from 'react-redux'
import ItemLevelForm from './itemLevelForm.jsx'
import levelActions from '../../actions/item-levels.js'
import questionActions from '../../actions/questions.js'
import _ from 'lodash'

const ItemLevel = React.createClass({

  deleteItemLevel: function (levelID) {
    this.props.dispatch(levelActions.deleteItemLevel(levelID))
    //must delete the itemLevel field from each question that has this level
    var questionKeys = _.keys(this.props.questions.data)
    questionKeys.forEach((key) => {
      if(this.props.itemLevels.data[levelID].name===this.props.questions.data[key].itemLevel) {
        this.props.dispatch(questionActions.submitQuestionEdit(key, {itemLevel: ""}))
      }
    })
  },

  toggleEdit: function () {
    this.props.dispatch(levelActions.startItemLevelEdit(this.props.params.levelID))
  },

  submitNewItemLevel: function (newItemLevel, levelID) {
    if(newItemLevel) {
      this.props.dispatch(levelActions.submitItemLevelEdit(levelID, newItemLevel))
    }
  },

  cancelEdit: function(levelID) {
      this.props.dispatch(levelActions.cancelItemLevelEdit(levelID))
  },

  render: function() {
    // this.props.params has the ID of the current itemLevel. this.props.itemLevels.data has all the itemLevels
    let data = this.props.itemLevels.data[this.props.params.itemLevelID]
    return (
      <ItemLevelForm data={data} levelID={this.props.params.itemLevelID} mode="Edit"
                     submitNewItemLevel={this.submitNewItemLevel} deleteItemLevel={this.deleteItemLevel}
                     cancelEdit={this.cancelEdit}/>
    )
  }
})

function select(state) {
  return {
    itemLevels: state.itemLevels,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(ItemLevel)
