'use strict'

 import React from 'react'
 import _ from 'underscore'

 export default  React.createClass({

  renderProblem: function () {
    if (this.props.data.problem) {
      return [(<dt><strong>Problem</strong></dt>),(<dd>{this.props.data.problem}</dd>)]
    }
  },

  renderSummary: function () {
    if (this.props.data.summary) {
      return [(<dt><strong>Summary</strong></dt>),(<dd>{this.props.data.summary}</dd>)]
    }
  },

  renderTeacherReview: function () {
    if (this.props.data.teacher_review) {
      return [(<dt><strong>Teacher Review</strong></dt>),(<dd>{this.props.data.teacher_review}</dd>)]
    }
  },

  renderAuthor: function () {
    if (this.props.data.author.description) {
      return [(<dt><strong>About the Author</strong></dt>),(<dd>{this.props.data.author.description}</dd>)]
    }
  },

  renderList: function () {
    return _.map(["renderProblem", "renderSummary", "renderAuthor", "renderTeacherReview"], function(name){
      return this[name]();
    }, this)
  },

  render: function () {
    return (
      <dl>
        {this.renderList()}
      </dl>
    )
  }
});
