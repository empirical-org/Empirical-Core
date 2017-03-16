'use strict'

 import React from 'react'
 import MarkdownParser from '../../../shared/markdown_parser.jsx'
 import _ from 'underscore'

 export default  React.createClass({

  renderProblem: function () {
    if (this.props.data.problem) {
      return [(<dt key='problem_title'><strong>Problem</strong></dt>),(<dd key='problem_text'>{this.props.data.problem}</dd>)]
    }
  },

  renderSummary: function () {
    if (this.props.data.summary) {
      return [(<dt key='summary_title' ><strong>Summary</strong></dt>),(<dd key='summary_text'>{this.props.data.summary}</dd>)]
    }
  },

  renderTeacherReview: function () {
    if (this.props.data.teacher_review) {
      return [(<dt key='review_title'><strong>Teacher Review</strong></dt>),(<dd key='review_text'>{this.props.data.teacher_review}</dd>)]
    }
  },

  renderAuthor: function () {
    if (this.props.data.author.description) {
      return [(<dt key='author_title'><strong>About the Author</strong></dt>),(<dd key='author_text'>{this.props.data.author.description}</dd>)]
    }
  },

  renderInfo: function () {
    if (this.props.data.activity_info) {
      return <MarkdownParser markdownText={this.props.data.activity_info}/>
    }
  },

  renderList: function () {
    const sections = _.map(['renderProblem', 'renderSummary', 'renderAuthor', 'renderTeacherReview'], function(name){
      return this[name]();
    }, this)
    return <dl>{sections}</dl>
  },

  render: function () {
    const content = this.props.data.activity_info ? this.renderInfo() : this.renderList()
    return (
      content
    )
  }
});
