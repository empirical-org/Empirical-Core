import React from 'react'
import ItemLevelForm from './itemLevelForm.jsx'
import levelActions from '../../actions/item-levels.js'
import {connect} from 'react-redux'
import Modal from '../modal/modal.jsx'
import {Link} from 'react-router'

const ItemLevels = React.createClass({

  createNew: function() {
    this.props.dispatch(levelActions.toggleNewItemLevelModal())
  },

  submitNewItemLevel: function () {
    var newItemLevel = {
      name: this.refs.newItemLevelName.value,
      description: this.refs.description.value,
      url: this.refs.url.value
    }
    this.props.dispatch(levelActions.submitNewItemLevel(newItemLevel))
    this.props.dispatch(levelActions.toggleNewItemLevelModal())
  },

  renderModal: function() {
    if(this.props.itemLevels.newConceptModalOpen)
      return (
        <Modal close={this.createNew}>
          <div className="box">
              <ItemLevelForm mode="New"/>
              <br />
              <p className="control">
                <button className={"button is-primary"} onClick={this.submitNewItemLevel}>Submit</button>
              </p>
          </div>
        </Modal>
      )
  },

  renderItemLevels: function() {
    console.log("this.props.itemLevels: ", this.props.itemLevels)
    const {data} = this.props.itemLevels
    const keys = _.keys(data);
    return keys.map((key) => {
      //console.log(key, data, data[key])
      return (<li><Link to={'admin/item-levels/' + key} activeClassName="is-active" key={key}>{data[key].name}</Link></li>)
    })
  },

  render: function() {
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
  }
})

function select(state) {
  return {
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(ItemLevels)
