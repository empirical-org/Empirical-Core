import React from 'react'
import ItemLevelForm from './itemLevelForm.jsx'
import levelActions from '../../actions/item-levels.js'
import {connect} from 'react-redux'
import Modal from '../modal/modal.jsx'
import {Link} from 'react-router'
import { LinkListItem } from 'quill-component-library/dist/componentLibrary';

const ItemLevels = React.createClass({

  createNew: function() {
    this.props.dispatch(levelActions.toggleNewItemLevelModal())
  },

  submitNewItemLevel: function (newItemLevel) {
    this.props.dispatch(levelActions.submitNewItemLevel(newItemLevel))
    this.props.dispatch(levelActions.toggleNewItemLevelModal())
  },

  renderModal: function() {
    if(this.props.itemLevels.newConceptModalOpen)
      return (
        <Modal close={this.createNew}>
          <div className="box">
              <ItemLevelForm mode="New" submitNewItemLevel={this.submitNewItemLevel}/>
          </div>
        </Modal>
      )
  },

  renderItemLevels: function() {
    const levels = this.props.itemLevels.data
    const levelKeys = _.keys(levels)


    return levelKeys.map((key) => {
      return (
        <LinkListItem
          key={key}
          itemKey={key}
          basePath='item-levels'
          activeClassName="is-active"
          text={levels[key].name}
        />
      )
    })
  },

  render: function() {
    if(this.props.itemLevels.hasreceiveddata) {
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
})

function select(state) {
  return {
    itemLevels: state.itemLevels,
    routing: state.routing,
    concepts: state.concepts
  }
}

export default connect(select)(ItemLevels)
