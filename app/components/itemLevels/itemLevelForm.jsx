import React from 'react'
import Modal from '../modal/modal.jsx'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'lodash'

const ItemLevelForm = React.createClass({

  getInitialState: function() {
    if(this.props.mode==="Edit") {
      return {name: this.props.data.name,
              description: this.props.data.description,
              url: this.props.data.url,
              conceptID: this.props.data.conceptID
      }
    } else {
        return {name: "",
                description: "",
                url: "",
                conceptID: ""
        }
      }
  },

  submit: function() {
    if(this.refs.concept.value==="Select Associated Concept" || this.refs.newItemLevelName.value==="") { //has not chosen an associated concept
      alert("You must choose a concept and name for this item level")
      return
    }
    var newItemLevel = {
      name: this.refs.newItemLevelName.value,
      description: this.refs.description.value,
      url: this.refs.url.value,
      conceptID: _.find(this.props.concepts.data, (concept) => {return concept.name===this.refs.concept.value}).key
    }
    this.props.submitNewItemLevel(newItemLevel, this.props.levelID) //id will be undefined if creating a new level
    this.setState(newItemLevel)
  },

  deleteItemLevel: function() {
    this.props.deleteItemLevel(this.props.levelID)
  },

  cancelEdit: function() {
    this.props.cancelEdit(this.props.levelID)
  },

  handleChange: function() {
    this.setState({
      name: this.refs.newItemLevelName.value,
      description: this.refs.description.value,
      url: this.refs.url.value,
      conceptID: this.refs.concept.value==="Select Associated Concept" ? "" : _.find(this.props.concepts.data, (concept) => {return concept.name===this.refs.concept.value}).key
    })
  },

  conceptsToOptions: function() {
    return hashToCollection(this.props.concepts.data).map((concept) => {
      return (
        <option value={concept.name} key={concept.key}>{concept.name}</option>
      )
    })
  },

  render: function() {
    if(this.props.concepts.hasreceiveddata===true) {
      let name="Name", description="description", url="www.quill.org", className="", cancelAndDeleteButtons=<div />;
      if(this.props.mode==="Edit") {
        name=this.props.data.name
        description=this.props.data.description
        url=this.props.data.url
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
          <label className="label">Description</label>
          <input
            className="input"
            type="text"
            placeholder={description}
            value={this.state.description}
            ref="description"
            onChange={this.handleChange}
          />
        </p>
        <p className="control">
          <label className="label">URL</label>
          <input
            className="input"
            type="text"
            placeholder={url}
            value={this.state.url}
            ref="url"
            onChange={this.handleChange}
          />
        </p>
        <p className="control">
          <label className="label">Concept</label>
          <span className="select">
            <select value={this.state.conceptID!=="" ? this.props.concepts.data[this.state.conceptID].name : "Select Associated Concept"} onChange={this.handleChange} ref="concept">
              <option value="Select Associated Concept">Select Associated Concept</option>
              {this.conceptsToOptions()}
            </select>
          </span>
        </p>
        <div className="control">
          <Link to={'admin/item-levels'}>
            <button className="button is-primary" onClick={this.submit}>Submit</button>
          </Link>
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
