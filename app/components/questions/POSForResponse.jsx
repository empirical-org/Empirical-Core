import React from 'react'
import C from '../../constants'
import questionActions from '../../actions/questions'
import sentenceFragmentActions from '../../actions/sentenceFragments'
import Question from '../../libs/question'
const jsDiff = require('diff');
import Modal from '../modal/modal.jsx'
import ResponseList from './responseList.jsx'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import Textarea from 'react-textarea-autosize';
var Markdown = require('react-remarkable');
import TextEditor from './textEditor.jsx';
import feedbackActions from '../../actions/concepts-feedback.js'
import ConceptSelector from 'react-select-search'

const feedbackStrings = {
  punctuationError: "punctuation error",
  typingError: "spelling mistake",
  caseError: "capitalization error"
}

export default React.createClass({

  getInitialState: function () {
    return {
      isExpanded: false
    }
  },

  toggleExpandSinglePOS: function() {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  },

  renderExpandedPOSListText: function() {
    if(this.state.isExpanded) {
      const tag = this.props.tag
      const additionalResponses = tag.responses.slice(1) //first response has already been rendered in unexpanded view
      if(additionalResponses.length===0) {
        return (<p>***No more responses match this pattern***</p>)
      }
      return additionalResponses.map((response) => {
        return (
          <p>{response.text}</p>
        )
      })
     }
  },

  renderExpandedPOSListCount: function() {
    if(this.state.isExpanded) {
      const tag = this.props.tag
      const additionalResponses = tag.responses.slice(1) //first response has already been rendered in unexpanded view
      return additionalResponses.map((response) => {
        return (
          <p>{response.count}</p>
        )
      })
    }
  },

  render: function () {
    const {headerStyle} = this.props
    if(this.state.isExpanded) {
      headerStyle["marginTop"] = "20px"
      headerStyle["marginBottom"] = "20px"
    } else {
      headerStyle["marginTop"] = "0px"
      headerStyle["marginBottom"] = "0px"
    }
    return (
      <header onClick={this.toggleExpandSinglePOS} className={"card-content " + this.props.bgColor} style={headerStyle}>
        <div className="content">
          <div className="media">
            <div className="media-content" style={this.props.contentStyle}>
              <p>{this.props.tagsToRender.join("---")}</p>
              <p>{this.props.tag.responses[0].text}</p>
              {this.renderExpandedPOSListText()}
            </div>
            <div className="media-right">
              <figure className="image is-32x32">
                <p>{this.props.icon} {this.props.tag.count===undefined ? 0 : this.props.tag.count}</p>
                <p>{this.props.tag.responses[0].count===undefined ? 0 : this.props.tag.responses[0].count}</p>
                {this.renderExpandedPOSListCount()}

              </figure>
            </div>
          </div>
        </div>
      </header>

    );
  }
})
