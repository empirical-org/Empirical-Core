import React from 'react'

const ArchivedButton = (props) => {
  let tagClass = 'tag';
  if (props.showOnlyArchived) {
    tagClass += ' is-info';
  }

  const text = props.lessons ? "Lessons With Archived Questions" : "Archived Questions";

  return (
    <div style={{display: 'inline-block', paddingLeft: '50px'}}>
      <label className="panel-checkbox toggle">
        <span className={tagClass} onClick={props.toggleShowArchived}>{text}</span>
      </label>
    </div>
  )
}

export { ArchivedButton }
