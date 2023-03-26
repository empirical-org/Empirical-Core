import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';
import { connect } from 'react-redux';
import { TextEditor } from '../../../Shared/index';
import titleCardActions from '../../actions/titleCards';

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
  constructor(props: TitleCardFormProps) {
    super(props)

    const { match, titleCards } = props
    const { params } = match
    const { titleCardID } = params
    const { data, hasreceiveddata } = titleCards
    if (titleCardID && hasreceiveddata) {
      const titleCard = data[titleCardID]
      const { title, content } = titleCard
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

  componentDidUpdate(prevProps: TitleCardFormProps) {
    const { match, titleCards } = this.props
    const { params } = match
    const { titleCardID } = params
    const { data, hasreceiveddata } = titleCards
    if (hasreceiveddata && !prevProps.titleCards.hasreceiveddata) {
      if (titleCardID && hasreceiveddata) {
        const titleCard = data[titleCardID]
        const { title, content } = titleCard
        this.setState({
          content: content ? content : this.state.content,
          title: title ? title : this.state.title
        })
      }
    }
  }

  submit = () => {
    const { dispatch, match, submit } = this.props
    const { params } = match
    const { titleCardID } = params
    if (submit) {
      submit(this.state)
    } else if (titleCardID) {
      dispatch(titleCardActions.submitTitleCardEdit(titleCardID, this.state))
    } else {
      dispatch(titleCardActions.submitNewTitleCard(this.state))
    }
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({title: e.target.value})
  }

  handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const formattedContent = e.replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>')
    this.setState({content: formattedContent})
  }

  renderHeaderText = () => {
    const { match } = this.props
    const { params } = match
    const { titleCardID } = params
    if (titleCardID) {
      return 'Edit this title card'
    } else {
      return 'Create a new title card'
    }
  }

  render() {
    const { content, title } = this.state
    return (
      <div className="admin-container">
        <div className="box">
          <h6 className="control subtitle">{this.renderHeaderText()}</h6>
          <br />
          <label className="label">Title</label>
          <textarea className="input" onChange={this.handleTitleChange} value={title || ""} />
          <br />
          <label className="label">Content</label>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handleContentChange}
            text={content || ""}
          />
          <br />
          <button className="button is-primary" onClick={this.submit}>Save Question</button>
        </div>
      </div>
    )
  }
}

function select(state: any) {
  return {
    titleCards: state.titleCards,
    routing: state.routing
  }
}

export default connect(select)(TitleCardForm)
