import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

class ItemLevelForm extends React.Component {

  state = {
    name: "",
    integerValue: "",
  };

  componentDidMount() {
    const { data, mode } = this.props;
    if(data && mode === "Edit") {
      const { integerValue, name } = data;
      this.setState({ integerValue: integerValue, name: name });
    }
  }

  submit = () => {
    const { levelID, submitNewItemLevel } = this.props;
    if(this.refs.newItemLevelName.value === "" || this.refs.integerValue.value === "") { //has not chosen an associated concept
      alert("You must choose a name for this item level")
      return
    }
    const newItemLevel = {
      name: this.refs.newItemLevelName.value,
      integerValue: this.refs.integerValue.value,
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
    this.setState({
      name: this.refs.newItemLevelName.value,
      integerValue: this.refs.integerValue.value,
    })
  };

  renderCancelAndDeleteButtons = () => {
    const { mode } = this.props;
    if(mode === "Edit") {
      return(
        <div className="button-group">
            <Link to={'/admin/item-levels'}>
              <button className={"button is-danger"} onClick={this.deleteItemLevel}>Delete</button>
            </Link>
            <Link to={'/admin/item-levels'}>
              <button className={"button is-info"} onClick={this.cancelEdit}>Cancel</button>
            </Link>
          </div>
      )
    }
  }

  render() {
    console.log('refs', this.refs);
    console.log('item-level-form-props', this.props);
    const { concepts } = this.props;
    const { hasreceiveddata } = concepts;
    if(hasreceiveddata === true) {
      let name="Name", integerValue="1", className="", cancelAndDeleteButtons=<div />;

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
            <Link to={'/admin/item-levels'}>
              <button className="button is-primary" onClick={this.submit}>Submit</button>
            </Link>
          </div>
          <div>
            {this.renderCancelAndDeleteButtons()}
          </div>
        </div>
        );
      } else {
        return <div>Loading...</div>
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
