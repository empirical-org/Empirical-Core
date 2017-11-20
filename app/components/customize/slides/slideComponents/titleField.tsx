import * as React from 'react'

interface titleFieldProps {
  clearSlide: Function,
  resetSlide: Function,
  handleTitleChange: any,
  questionIndex: Number,
  title: string
}

const TitleField: React.SFC<titleFieldProps> = (props) => {
  return <div className="title-field field">
    <div className="spread-label">
      <label>Title</label>
      <div className="options">
        <span className="clear-slide" onClick={() => props.clearSlide(props.questionIndex)}>
          <i className="fa fa-icon fa-times-circle"/>
          Clear Slide
        </span>
        <span className="reset-slide" onClick={() => props.resetSlide(props.questionIndex)}>
          <i className="fa fa-icon fa-refresh"/>
          Reset Slide
        </span>
      </div>
    </div>
    <div className="control">
      <input value={props.title} onChange={props.handleTitleChange} className="input" type="text"/>
    </div>
  </div>
}

export default TitleField
