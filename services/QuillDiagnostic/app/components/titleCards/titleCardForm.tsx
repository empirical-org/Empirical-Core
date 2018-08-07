import React from 'react'
import { connect } from 'react-redux'
import {
  TextEditor,
  hashToCollection
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
  routeParams: any
  dispatch(any): void 
}


class TitleCardForm extends React.Component<TitleCardFormProps, TitleCardFormState> {
  constructor(props) {
    super(props)

    if (props.routeParams.titleCardID && props.titleCards.hasreceiveddata) {
      const {titleCardID} = props.routeParams
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

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.submit = this.submit.bind(this)
    this.renderHeaderText = this.renderHeaderText.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.titleCards.hasreceiveddata && !this.props.titleCards.hasreceiveddata) {
      if (nextProps.routeParams.titleCardID && nextProps.titleCards.hasreceiveddata) {
        const {titleCardID} = nextProps.routeParams
        const titleCard = nextProps.titleCards.data[titleCardID]
        const {title, content} = titleCard
        this.setState({
          content: content ? content : this.state.content,
          title: title ? title : this.state.title
        })
      }
    }
  }

  submit() {
    const { titleCardID } = this.props.routeParams
    if (titleCardID) {
      this.props.dispatch(submitTitleCardEdit(titleCardID, this.state))
    } else {
      this.props.dispatch(submitNewTitleCard(this.state))
    }
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value})
  }

  handleContentChange(e) {
    const formattedContent = e.replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>')
    this.setState({content: formattedContent})
  }

  renderHeaderText() {
    const { titleCardID } = this.props.routeParams
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
        <br/>
        <label className="label">Title</label>
        <textarea className="input" value={this.state.title || ""} onChange={this.handleTitleChange}/>
        <br/>
        <label className="label">Content</label>
        <TextEditor
          text={this.state.content || ""}
          handleTextChange={this.handleContentChange}
          EditorState={EditorState}
          ContentState={ContentState}
        />
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
