import React from 'react'
import Modal from '../modal/modal.jsx'

export default React.createClass({

  render: function() {
    let name="Name", description="description", url="url", className=""
    if(this.props.mode==="Edit") {
      // name = this.props.data.name;
      // description=this.props.data.description;
      // url=this.props.data.url;
      className="box"
    }
    return (
      <div className={className}>
      <h4 className="title">Add New Item Level</h4>
        <p className="control">
          <label className="label">{name}</label>
          <input
            className="input"
            type="text"
            placeholder="Name"
            ref="newItemLevelName"
          />
        </p>
        <p className="control">
          <label className="label">{description}</label>
          <input
            className="input"
            type="text"
            placeholder="Description"
            ref="description"
          />
        </p>
        <p className="control">
          <label className="label">{url}</label>
          <input
            className="input"
            type="text"
            placeholder="www.quill.org"
            ref="url"
          />
        </p>
        </div>
    )
  }
})
