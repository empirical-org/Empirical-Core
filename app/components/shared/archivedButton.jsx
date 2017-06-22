import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'

const ArchivedButton = React.createClass({
	render() {
	    let tagClass = 'tag';
	    if (this.props.showOnlyArchived) {
	      tagClass += ' is-info';
	    }

	    const text = this.props.lessons ? "Lessons With Archived Questions" : "Archived Questions";
	    
	    return (
	      <label className="panel-checkbox toggle" style={{display: "block"}}>
	        <span className={tagClass} onClick={this.props.toggleShowArchived}>{text}</span>
	      </label>
	    )
	}
})

export default connect()(ArchivedButton)