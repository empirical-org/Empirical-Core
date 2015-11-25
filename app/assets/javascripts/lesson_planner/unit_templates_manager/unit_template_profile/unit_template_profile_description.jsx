EC.UnitTemplateProfileDescription = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <dl>
        <dt><strong>Problem</strong></dt>
        <dd>{this.props.data.model["problem"]}</dd>
        <dt><strong>Summary</strong></dt>
        <dd>{this.props.data.model["summary"]}</dd>
        <dt><strong>About the Author</strong></dt>
        <dd>{this.props.data.model["author"]["description"]}</dd>
        <dt><strong>Teacher Review</strong></dt>
        <dd>{this.props.data.model["teacher_review"]}</dd>
      </dl>
    )
  }
});