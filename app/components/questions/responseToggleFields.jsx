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
          {this.renderToggleField(this.props.labels[0])}
          {this.renderToggleField(this.props.labels[1])}
          {this.renderToggleField(this.props.labels[3])}
          {this.renderToggleField(this.props.labels[4])}
        </div>
        <p>Additionally, filter responses by feedback algorithm</p>
        <div className="columns">
          {this.renderToggleField(this.props.labels[5])}
          {this.renderToggleField(this.props.labels[6])}
          {this.renderToggleField(this.props.labels[7])}
          {this.renderToggleField(this.props.labels[8])}
          {this.renderToggleField(this.props.labels[9])}
          {this.renderToggleField(this.props.labels[10])}
          {this.renderToggleField(this.props.labels[11])}
        </div>
        <button className="button is-light" onClick={this.props.resetFields}>Reset All</button>
      </div>
    )
  }
})
