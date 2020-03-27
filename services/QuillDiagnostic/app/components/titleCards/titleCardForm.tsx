import React from 'react'
import { connect } from 'react-redux'
import {
  TextEditor
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import {
  submitNewTitleCard,
  submitTitleCardEdit
} from '../../actions/titleCards'
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

  state = {
    title: '',
    content: ''
  }

  componentDidMount() {
    const { match, titleCards } = this.props
    const { data, hasreceiveddata } = titleCards
    const { params } = match
    const { titleCardID } = params
    if(titleCardID && hasreceiveddata) {
      const titleCard = data[titleCardID]
      const {title, content} = titleCard
      this.setState({ title: title ? title : '', content: content ? content : '' })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: TitleCardFormProps) {
    const { titleCards, match } = nextProps
    const { data, hasreceiveddata } = titleCards
    const { params } = match
    const { titleCardID } = params
    if (hasreceiveddata && titleCardID && !this.props.titleCards.hasreceiveddata) {
      const titleCard = data[titleCardID]
      const { title, content } = titleCard
      this.setState({
        content: content ? content : this.state.content,
        title: title ? title : this.state.title
      })
    }
  }

  submit = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { titleCardID } = params
    if (titleCardID) {
      dispatch(submitTitleCardEdit(titleCardID, this.state))
    } else {
      dispatch(submitNewTitleCard(this.state))
    }
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value})
  }

  handleContentChange = (e) => {
    const formattedContent = e.replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>')
    this.setState({content: formattedContent})
  }

  render() {
    const { content, title } = this.state
    const { match } = this.props
    const { params } = match
    const { titleCardID } = params
    return (
      <div className="admin-container">
        <div className="box">
          <h6 className="control subtitle">{titleCardID ? 'Edit this title card' : 'Create a new title card'}</h6>
          <br />
          <label className="label">Title</label>
          <textarea className="input" onChange={this.handleTitleChange} value={title} />
          <br />
          <label className="label">Content</label>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handleContentChange}
            text={content}
          />
          <br />
          <button className="button is-primary" onClick={this.submit}>Save Question</button>
        </div>
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
