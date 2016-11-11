import React from 'react'

export default React.createClass({
  renderToggleField: function (status) {
    var tagClass = "tag"
    var addColorToTag = false
    if(!!this.props.visibleStatuses[status]) addColorToTag = true

    if(addColorToTag) {
      switch(status) {
        case "Human Optimal":
          tagClass += " is-success"
          break

        case "Human Sub-Optimal":
          tagClass += " is-warning"
          break

        case "Algorithm Sub-Optimal":
          tagClass += " is-info"
          break

        case "Unmatched":
          tagClass += " is-danger"
          break

        default:
          tagClass += " is-dark"
      }
    }

    return (
      <div className="column">
        <label className="panel-checkbox toggle">
          <span className={tagClass} onClick={this.toggleFieldAndResetPage.bind(null, status)}>{status}</span>
        </label>
      </div>
    )
  },

  toggleFieldAndResetPage: function(status) {
    this.props.resetPageNumber()
    this.props.toggleField(status)
  },

  render: function () {
    return (
      <div>
        <p>Filter responses by correctness of response</p>
        <div className="columns is-multiline">
          {this.props.qualityLabels.map((label) => {
            return this.renderToggleField(label)
          })}
        </div>
        <p>Additionally, filter responses by feedback algorithm</p>
        <div className="columns">
          {this.props.labels.map((label) => {
            return this.renderToggleField(label)
          })}
          {this.renderToggleField("No Hint")}
        </div>
      </div>
    )
  }
})
