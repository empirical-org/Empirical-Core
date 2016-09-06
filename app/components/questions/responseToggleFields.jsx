import React from 'react'

export default React.createClass({
  renderToggleField: function (status) {
    var checkBox = (
      <input
        onChange={this.toggleFieldAndResetPage.bind(null, status)}
        type="checkbox"
        checked={!!this.props.visibleStatuses[status]} />
    )
    return (
      <div className="column">
        <label className="panel-checkbox toggle">
          {checkBox}
          {status}
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
        <p className="label">Filter responses by correctness of response</p>
        <div className="columns is-multiline">
          {this.renderToggleField(this.props.labels[0])}
          {this.renderToggleField(this.props.labels[1])}
          {this.renderToggleField(this.props.labels[3])}
          {this.renderToggleField(this.props.labels[4])}
        </div>
        <p className="label">Filter responses by feedback algorithm</p>
        <div className="columns">
          {this.renderToggleField(this.props.labels[5])}
          {this.renderToggleField(this.props.labels[6])}
          {this.renderToggleField(this.props.labels[7])}
          {this.renderToggleField(this.props.labels[8])}
          {this.renderToggleField(this.props.labels[9])}
          {this.renderToggleField(this.props.labels[10])}
          {this.renderToggleField(this.props.labels[11])}
        </div>
      </div>
    )
  }
})
