import React from 'react'
import {connect} from 'react-redux'

const ArchivedButton = React.createClass({
  render() {
    let tagClass = 'tag';
    if (this.props.showOnlyArchived) {
      tagClass += ' is-info';
    }

    const text = this.props.lessons ? "Lessons With Archived Questions" : "Archived Questions";
    
    return (
      <div style={{display: 'inline-block', paddingLeft: '50px'}}>
        <label className="panel-checkbox toggle">
          <span className={tagClass} onClick={this.props.toggleShowArchived}>{text}</span>
        </label>
      </div>
    )
  }
})

export default connect()(ArchivedButton)