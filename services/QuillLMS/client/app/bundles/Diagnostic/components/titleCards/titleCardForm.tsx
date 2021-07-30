import * as React from 'react'
import { connect } from 'react-redux'
import { EditorState, ContentState } from 'draft-js'
import {
  submitNewTitleCard,
  submitTitleCardEdit
} from '../../actions/titleCards'
import { commonText } from '../../modules/translation/commonText';
import {
  hashToCollection,
  TextEditor
} from '../../../Shared/index'

import _ from 'lodash'

interface TitleCardFormState {
  title: string,
  content: string,
  titleChanged: boolean
}

export interface TitleCardFormProps {
  titleCards: any
  routing: any
  history: any
  match: any
  dispatch(any): void
}


class TitleCardForm extends React.Component<TitleCardFormProps, TitleCardFormState> {
  constructor(props) {
    super(props)

    if (props.match.params.titleCardID && props.titleCards.hasreceiveddata) {
      const {titleCardID} = props.match.params
      const titleCard = props.titleCards.data[titleCardID]
      this.state = {
        content: titleCard && titleCard.content ? titleCard.content : '',
        title: titleCard && titleCard.title ? titleCard.title : '',
        titleChanged: false,
      }
    } else {
      this.state = {
        title: '',
        content: '',
        titleChanged: false,
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.titleCards.hasreceiveddata && !prevProps.titleCards.hasreceiveddata) {
      if (this.props.match.params.titleCardID && this.props.titleCards.hasreceiveddata) {
        const {titleCardID} = this.props.match.params
        const titleCard = this.props.titleCards.data[titleCardID]
        this.setState({
          content: titleCard && titleCard.content ? titleCard.content : this.state.content,
          title: titleCard && titleCard.title ? titleCard.title : this.state.title
        })
      }
    }
  }

  submit = () => {
    const { dispatch, history, match } = this.props
    const { params } = match
    const { titleCardID } = params
    const { title, titleChanged } = this.state
    // TODO: fix add/edit title card action to show new/updated title card without refreshing
    if (this.warnTitleChange(title, titleChanged)) {
      if (titleCardID) {
        dispatch(submitTitleCardEdit(titleCardID, this.state))
      } else {
        dispatch(submitNewTitleCard(this.state))
      }
      history.push(`/admin/title-cards`)
    }
  }

  warnTitleChange = (title, titleChanged) => {
    const { match } = this.props
    const { params } = match
    const { titleCardID } = params
    const translationMappingMissing = commonText[title] == undefined
    if (titleCardID && titleChanged && translationMappingMissing) {
      return confirm(`Making this change will break the translation mapping because "${title}" does not yet exist on the mappings. Make a request on the support board to change the translation mapping before making this change. Are you sure you want to proceed?`)
    }
    return true
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value, titleChanged: true})
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
