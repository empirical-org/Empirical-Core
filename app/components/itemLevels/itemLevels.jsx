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

  submitNewItemLevel: function (newItemLevel) {
    // var newItemLevel = {
    //   name: this.refs.newItemLevelName.value,
    //   description: this.refs.description.value,
    //   url: this.refs.url.value
    //   concept: this.refs.concept.value
    // }
    this.props.dispatch(levelActions.submitNewItemLevel(newItemLevel))
    this.props.dispatch(levelActions.toggleNewItemLevelModal())
  },

  // <br />
  // <p className="control">
  //   <button className={"button is-primary"} onClick={this.submitNewItemLevel}>Submit</button>
  // </p> THIS WAS TAKEN OUT FROM renderModal below

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
    const concepts = this.props.concepts.data, levels = this.props.itemLevels.data
    const levelKeys = _.keys(levels)
    const conceptKeys = _.keys(concepts)

    return conceptKeys.map((id) => {
      var levelsToRender;
      if(_.some(levels, ['conceptID', id])) { //if any of the levels are associated with this concept
        var levelsToRender = _.filter(levelKeys, (levelKey) => {
          return levels[levelKey].conceptID===id
        })

        levelsToRender = levelsToRender.map((key) => {
          return (<li key={key}><Link to={'admin/item-levels/' + key} activeClassName="is-active">{levels[key].name}</Link></li>)
        })

        return (
          <div key={id}>
            <Link to={'admin/concepts/'+id}><div className="menu-label">{concepts[id].name}</div></Link>
            <ul className="menu-list">{levelsToRender}</ul>
          </div>
        )
      } else {
        return <div />
      }
    })

    // const {data} = this.props.itemLevels
    // const keys = _.keys(data);
    // return keys.map((key) => {
    //   return (<li key={key}><Link to={'admin/item-levels/' + key} activeClassName="is-active">{data[key].name}</Link></li>)
    // })
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
    routing: state.routing,
    concepts: state.concepts
  }
}

export default connect(select)(ItemLevels)
