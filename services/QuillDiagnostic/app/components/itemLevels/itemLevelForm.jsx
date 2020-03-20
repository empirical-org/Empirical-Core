import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import _ from 'lodash'

class ItemLevelForm extends React.Component {
  constructor(props) {
    super(props);
    const { data, mode } = props;
    const { integerValue, name } = data;
    if(mode==="Edit") {
      this.state = {
        name,
        integerValue,
      };

      return;
    } else {
      this.state = {
        name: "",
        integerValue: "",
      };

      return;
    }
  }

  submit = () => {
    const { levelID, submitNewItemLevel } = this.props;
    const { integerValue, newItemLevelName } = this.refs;
    if(newItemLevelName.value==="" || integerValue.value==="") { //has not chosen an associated concept
      alert("You must choose a name for this item level")
      return
    }
    var newItemLevel = {
      name: newItemLevelName.value,
      integerValue: integerValue.value,
    }
    submitNewItemLevel(newItemLevel, levelID) //id will be undefined if creating a new level
    this.setState(newItemLevel)
  };

  deleteItemLevel = () => {
    const { deleteItemLevel, levelID } = this.props;
    if(confirm("Are you sure you want to delete this item level?")) {
      deleteItemLevel(levelID)
    }
  };

  cancelEdit = () => {
    const { cancelEdit, levelID } = this.props;
    cancelEdit(levelID)
  };

  handleChange = () => {
    const { integerValue, newItemLevelName } = this.refs;
    this.setState({
      name: newItemLevelName.value,
      integerValue: integerValue.value,
    })
  };

  render() {
    const { concepts, data, mode } = this.props;
    const { hasreceiveddata } = concepts;
    if(hasreceiveddata === true) {
      let name="Name", integerValue="1", className="", cancelAndDeleteButtons=<div />;
      if(mode==="Edit") {
        name= data.name
        integerValue= data.integerValue
        className="box"
        cancelAndDeleteButtons =
          (<div className="button-group">
            <Link to={'/admin/item-levels'}>
              <button className={"button is-danger"} onClick={this.deleteItemLevel}>Delete</button>
            </Link>
            <Link to={'/admin/item-levels'}>
              <button className={"button is-info"} onClick={this.cancelEdit}>Cancel</button>
            </Link>
          </div>)
      }

      return (
        <div className={className}>
          <h4 className="title">Add New Item Level</h4>
          <p className="control">
            <label className="label">Name</label>
            <input
              className="input"
              onChange={this.handleChange}
              placeholder={name}
              ref="newItemLevelName"
              type="text"
              value={this.state.name}
            />
          </p>
          <p className="control">
            <label className="label">Integer Value</label>
            <input
              className="input"
              onChange={this.handleChange}
              placeholder={integerValue}
              ref="integerValue"
              type="text"
              value={this.state.integerValue}
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
}

function select(state) {
  return {
    routing: state.routing,
    concepts: state.concepts
  }
}

export default connect(select)(ItemLevelForm)
