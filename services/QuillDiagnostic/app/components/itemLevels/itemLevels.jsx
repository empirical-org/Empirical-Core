import React from 'react'
import {
  Modal
} from 'quill-component-library/dist/componentLibrary'
import { LinkListItem } from '../shared/linkListItem'
import ItemLevelForm from './itemLevelForm.jsx'
import levelActions from '../../actions/item-levels.js'
import { connect } from 'react-redux'

class ItemLevels extends React.Component {
  createNew = () => {
    const { dispatch } = this.props;
    dispatch(levelActions.toggleNewItemLevelModal())
  };

  submitNewItemLevel = (newItemLevel) => {
    const { dispatch } = this.props;
    dispatch(levelActions.submitNewItemLevel(newItemLevel))
    dispatch(levelActions.toggleNewItemLevelModal())
  };

  renderModal = () => {
    const { itemLevels } = this.props;
    const { newConceptModalOpen } = itemLevels;
    if(newConceptModalOpen)
      return (
        <Modal close={this.createNew}>
          <div className="box">
            <ItemLevelForm mode="New" submitNewItemLevel={this.submitNewItemLevel} />
          </div>
        </Modal>
      )
  };

  renderItemLevels = () => {
    const { itemLevels } = this.props;
    const { data } = itemLevels;
    const levelKeys = _.keys(data)


    return levelKeys.map((key) => {
      return (
        <LinkListItem
          activeClassName="is-active"
          basePath='item-levels'
          itemKey={key}
          key={key}
          text={data[key].name}
        />
      )
    })
  };

  render() {
    const { itemLevels } = this.props;
    const { hasreceiveddata } = itemLevels;
    if(hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            <h1 className="title">
              <button className="button is-primary" onClick={this.createNew}>Create New Item Level</button>
            </h1>
            {this.renderModal()}
            <aside className="menu">
              <p className="menu-label">
                    Item Levels
              </p>
              <ul className="menu-list">
                {this.renderItemLevels()}
              </ul>
            </aside>
          </div>
        </section>
      )
    } else {
      return (
        <div className="container">Loading...</div>
      )
    }
  }
}

function select(state) {
  return {
    itemLevels: state.itemLevels,
    routing: state.routing,
    concepts: state.concepts
  }
}

export default connect(select)(ItemLevels)
