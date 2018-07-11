import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import _ from 'lodash'

const ItemLevelForm = React.createClass({

  getInitialState: function() {
    if(this.props.mode==="Edit") {
      return {
        name: this.props.data.name,
        integerValue: this.props.data.integerValue,
      }
    } else {
        return {
          name: "",
          integerValue: "",
        }
      }
  },

  submit: function() {
    if(this.refs.newItemLevelName.value==="" || this.refs.integerValue.value==="") { //has not chosen an associated concept
      alert("You must choose a name for this item level")
      return
    }
    var newItemLevel = {
      name: this.refs.newItemLevelName.value,
      integerValue: this.refs.integerValue.value,
    }
    this.props.submitNewItemLevel(newItemLevel, this.props.levelID) //id will be undefined if creating a new level
    this.setState(newItemLevel)
  },

  deleteItemLevel: function() {
    if(confirm("Are you sure you want to delete this item level?")) {
      this.props.deleteItemLevel(this.props.levelID)
    }
  },

  cancelEdit: function() {
    this.props.cancelEdit(this.props.levelID)
  },

  handleChange: function() {
    this.setState({
      name: this.refs.newItemLevelName.value,
      integerValue: this.refs.integerValue.value,
    })
  },

  render: function() {
    if(this.props.concepts.hasreceiveddata===true) {
      let name="Name", integerValue="1", className="", cancelAndDeleteButtons=<div />;
      if(this.props.mode==="Edit") {
        name=this.props.data.name
        integerValue=this.props.data.integerValue
        className="box"
        cancelAndDeleteButtons =
          <div className="button-group">
            <Link to={'/admin/item-levels'}>
              <button className={"button is-danger"} onClick={this.deleteItemLevel}>Delete</button>
            </Link>
            <Link to={'/admin/item-levels'}>
              <button className={"button is-info"} onClick={this.cancelEdit}>Cancel</button>
            </Link>
          </div>
      }

      return (
      <div className={className}>
        <h4 className="title">Add New Item Level</h4>
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            placeholder={name}
            value={this.state.name}
            ref="newItemLevelName"
            onChange={this.handleChange}
          />
        </p>
        <p className="control">
          <label className="label">Integer Value</label>
          <input
            className="input"
            type="text"
            placeholder={integerValue}
            value={this.state.integerValue}
            ref="integerValue"
            onChange={this.handleChange}
          />
        </p>
        <div className="control">
          <Link to={'admin/item-levels'}>
            <button className="button is-primary" onClick={this.submit}>Submit</button>
          </Link>
        </div>
        <div>
          {cancelAndDeleteButtons}
        </div>
      </div>
    )} else {
        return (
          <div>Loading...</div>
        )
    }
  }
})

function select(state) {
  return {
    routing: state.routing,
    concepts: state.concepts
  }
}

export default connect(select)(ItemLevelForm)
