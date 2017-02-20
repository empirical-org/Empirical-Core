'use strict'

 import React from 'react'
 import _ from 'underscore'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  renderProblem: function () {
    if (this.props.data.model["problem"]) {
      return [(<dt><strong>Problem</strong></dt>),(<dd>{this.props.data.model["problem"]}</dd>)]
    }
  },

  renderSummary: function () {
    if (this.props.data.model["summary"]) {
      return [(<dt><strong>Summary</strong></dt>),(<dd>{this.props.data.model["summary"]}</dd>)]
    }
  },

  renderTeacherReview: function () {
    if (this.props.data.model["teacher_review"]) {
      return [(<dt><strong>Teacher Review</strong></dt>),(<dd>{this.props.data.model["teacher_review"]}</dd>)]
    }
  },

  renderAuthor: function () {
    if (this.props.data.model["author"]["description"]) {
      return [(<dt><strong>About the Author</strong></dt>),(<dd>{this.props.data.model["author"]["description"]}</dd>)]
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
