import React from 'react'
import {connect} from 'react-redux'
import ItemLevelForm from './itemLevelForm.jsx'
import levelActions from '../../actions/item-levels'
import questionActions from '../../actions/questions'
import _ from 'lodash'
import { Spinner } from 'quill-component-library/dist/componentLibrary'

class ItemLevel extends React.Component {

  componentDidMount() {
    console.log('componentDidMount item-level-props', this.props);
  }
  deleteItemLevel = (levelID) => {
    const { dispatch, itemLevels, questions } = this.props;
    dispatch(levelActions.deleteItemLevel(levelID))
    //must delete the itemLevel field from each question that has this level
    var questionKeys = _.keys(questions.data)
    questionKeys.forEach((key) => {
      if(itemLevels.data[levelID].name === questions.data[key].itemLevel) {
        dispatch(questionActions.submitQuestionEdit(key, {itemLevel: ""}))
      }
    })
  };

  toggleEdit = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { levelID } = params
    dispatch(levelActions.startItemLevelEdit(levelID))
  };

  submitNewItemLevel = (newItemLevel, levelID) => {
    const { dispatch } = this.props;
    if(newItemLevel) {
      dispatch(levelActions.submitItemLevelEdit(levelID, newItemLevel))
    }
  };

  cancelEdit = (levelID) => {
    const { dispatch } = this.props;
      dispatch(levelActions.cancelItemLevelEdit(levelID))
  };

  render() {
    const { itemLevels, match } = this.props
    const { data } = itemLevels
    const { params } = match
    const { itemLevelID } = params
    console.log('item-level-props', this.props);
    console.log('data', data[itemLevelID]);
    return (
      <ItemLevelForm
        cancelEdit={this.cancelEdit}
        data={data[itemLevelID]}
        deleteItemLevel={this.deleteItemLevel}
        levelID={itemLevelID}
        mode="Edit"
        submitNewItemLevel={this.submitNewItemLevel}
      />
    )
  }
}

function select(state) {
  return {
    itemLevels: state.itemLevels,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(ItemLevel)
