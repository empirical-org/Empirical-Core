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
      <li>
        <label className="panel-checkbox toggle">
          {checkBox}
          {status}
        </label>
      </li>
    )
  },

  render: function () {
    return (
      <ul>
        {this.renderToggleField(this.props.labels[0])}
        {this.renderToggleField(this.props.labels[1])}
        {this.renderToggleField(this.props.labels[2])}
        {this.renderToggleField(this.props.labels[3])}
      </ul>
    )
  }
})
