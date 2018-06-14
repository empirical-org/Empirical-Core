import React from 'react'
import { connect } from 'react-redux'
import TextEditor from '../questions/textEditor.jsx';
import {hashToCollection} from '../../libs/hashToCollection'
import {submitNewTitleCard} from '../../actions/titleCards.ts'
import _ from 'lodash'

class TitleCardForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: ''
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  submit() {
    this.props.dispatch(submitNewTitleCard(this.state))
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value})
  }

  handleContentChange(e) {
    this.setState({content: e})
  }

  render() {
    return (
      <div className="box">
        <h6 className="control subtitle">Create a new title card</h6>
        <br/>
        <label className="label">Title</label>
        <textarea className="input" type="text" value={this.state.title || ""} onChange={this.handleTitleChange}/>
        <br/>
        <label className="label">Content</label>
        <TextEditor text={this.state.content || ""} handleTextChange={this.handleContentChange}/>
        <br/>
        <button className="button is-primary" onClick={this.submit}>Save Question</button>
      </div>
    )
  }
}

function select(state) {
  return {
    titleCards: state.titleCards,
    routing: state.routing
  }
}

export default connect(select)(TitleCardForm)
