import React from 'react'
import { connect } from 'react-redux'
import { EditorState, ContentState } from 'draft-js'
import {
  submitNewTitleCard,
  submitTitleCardEdit
} from '../../actions/titleCards.ts'
import {
  hashToCollection,
  TextEditor
} from '../../../Shared/index'

import _ from 'lodash'

interface TitleCardFormState {
  title: string,
  content: string
}

export interface TitleCardFormProps {
  titleCards: any
  routing: any
  match: any
  dispatch(any): void
}


class TitleCardForm extends React.Component<TitleCardFormProps, TitleCardFormState> {
  constructor(props) {
    super(props)

    if (props.match.params.titleCardID && props.titleCards.hasreceiveddata) {
      const {titleCardID} = props.match.params
      const titleCard = props.titleCards.data[titleCardID]
      const {title, content} = titleCard
      this.state = {
        content: content ? content : '',
        title: title ? title : ''
      }
    } else {
      this.state = {
        title: '',
        content: ''
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.titleCards.hasreceiveddata && !prevProps.titleCards.hasreceiveddata) {
      if (this.props.match.params.titleCardID && this.props.titleCards.hasreceiveddata) {
        const {titleCardID} = this.props.match.params
        const titleCard = this.props.titleCards.data[titleCardID]
        const {title, content} = titleCard
        this.setState({
          content: content ? content : this.state.content,
          title: title ? title : this.state.title
        })
      }
    }
  }

  submit = () => {
    const { dispatch, history, match } = this.props
    const { params } = match
    const { titleCardID } = params
    // TODO: fix add/edit title card action to show new/updated title card without refreshing
    if (titleCardID) {
      dispatch(submitTitleCardEdit(titleCardID, this.state))
    } else {
      dispatch(submitNewTitleCard(this.state))
    }
    history.push(`/admin/title-cards`)
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value})
  }

  handleContentChange = (e) => {
    const formattedContent = e.replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>')
    this.setState({content: formattedContent})
  }

  renderHeaderText = () => {
    const { titleCardID } = this.props.match.params
    if (titleCardID) {
      return 'Edit this title card'
    } else {
      return 'Create a new title card'
    }
  }

  render() {
    return (
      <div className="box">
        <h6 className="control subtitle">{this.renderHeaderText()}</h6>
        <br />
        <label className="label">Title</label>
        <textarea className="input" onChange={this.handleTitleChange} value={this.state.title || ""} />
        <br />
        <label className="label">Content</label>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handleContentChange}
          text={this.state.content || ""}
        />
        <br />
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
