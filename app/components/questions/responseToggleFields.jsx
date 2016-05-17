import React from 'react'

export default React.createClass({
  renderToggleField: function (status) {
    var checkBox = (
      <input
        onChange={this.props.toggleField.bind(null, status)}
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

  render: function () {
    return (
      <div className="columns is-multiline">
        {this.renderToggleField(this.props.labels[0])}
        {this.renderToggleField(this.props.labels[1])}
        {this.renderToggleField(this.props.labels[3])}
        {this.renderToggleField(this.props.labels[4])}
      </div>
    )
  }
})
