import * as React from 'react'
import { connect } from 'react-redux'
import { EditorState, ContentState } from 'draft-js'
import {
  submitNewTitleCard,
  submitTitleCardEdit
} from '../../actions/titleCards'
import { commonText } from '../../modules/translation/commonText';
import { TextEditor, Modal } from '../../../Shared/index'

import _ from 'lodash'

interface TitleCardFormState {
  title: string,
  content: string,
  titleChanged: boolean,
  showModal: boolean
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
        showModal: false
      }
    } else {
      this.state = {
        title: '',
        content: '',
        titleChanged: false,
        showModal: false
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
    const { titleChanged } = this.state
    // TODO: fix add/edit title card action to show new/updated title card without refreshing
    if (this.warnTitleChange(titleChanged)) {
      if (titleCardID) {
        dispatch(submitTitleCardEdit(titleCardID, this.state))
      } else {
        dispatch(submitNewTitleCard(this.state))
      }
      history.push(`/admin/title-cards`)
    }
  }

  warnTitleChange = (titleChanged: boolean) => {
    const { title, showModal } = this.state
    const { match } = this.props
    const { params } = match
    const { titleCardID } = params
    const translationMappingMissing = commonText[title] === undefined
    if (titleCardID && titleChanged && translationMappingMissing && !showModal) {
      this.setState({ showModal: true })
      return false;
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

  handleConfirm = () => {
    this.submit()
  }

  handleCancel= () => {
    this.setState({ showModal: false })
  }

  renderModal = () => {
    return(
      <Modal>
        <div className="box confirmation-modal-container">
          <p>Making this change will break the translation mapping because this new title does not yet exist on the mappings. If this change is intended, <a className="data-link" href="https://www.notion.so/quill/Support-requests-for-ELL-translation-updates-1d53a9b3babc441885194400c7fbda26" rel="noopener noreferrer" target="_blank">please make a request on the support board</a> to change the translation mapping before making this change. Are you sure you want to proceed?</p>
          <section className="button-container">
            <button className="quill-button fun primary contained" onClick={this.handleConfirm}>Confirm</button>
            <button className="quill-button fun primary contained" onClick={this.handleCancel}>Cancel</button>
          </section>
        </div>
      </Modal>
    )
  }

  render() {
    const { showModal, title, content } = this.state;
    return (
      <div className="box">
        {showModal && this.renderModal()}
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
