import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default React.createClass({
  callToggleActivitySelection(e) {
    const true_or_false = ($(e.target).attr('checked') == 'checked');
    this.props.toggleActivitySelection(this.props.data, true_or_false);
  },
  tooltipTrigger(e) {
    e.stopPropagation();
    $(this.refs.activateTooltip).tooltip('show');
  },

  tooltipTriggerStop(e) {
    e.stopPropagation();
    $(this.refs.activateTooltip).tooltip('hide');
  },

  render() {
    const selectedClass = this.props.selected ? 'selected' : '';
    const toolTip = this.props.data.activity_classification

    ? (<div
      ref="activateTooltip"
      className={`icon-${this.props.data.activity_classification.id}-green-no-border`}
      data-html="true"
      data-toggle="tooltip"
      data-placement="top"
      title={`<h1>${this.props.data.name}</h1><p>App: ${this.props.data.activity_classification.alias}</p><p>${this.props.data.section.name}</p><p>${this.props.data.topic_name}</p><p>${this.props.data.description}</p>`}
    />)
    : <span />;
    return (
      <tr onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className={`tooltip-trigger ${selectedClass}`}>
        <td>{this.props.data.activity_category ? this.props.data.activity_category.name : ''}</td>
        <td>
          {toolTip}
        </td>
        <td className="activity_name">
          <a className="activity_link" href={this.props.data.anonymous_path} target="_new">
            {this.props.data.name}
          </a>
        </td>


        <td>
          <input type="checkbox" checked={this.props.selected} onChange={this.callToggleActivitySelection} id={`activity_${this.props.data.id}`} data-model-id={this.props.data.id} className="css-checkbox" />
          <label htmlFor={`activity_${this.props.data.id}`} id={`activity_${this.props.data.id}`} className="css-label" />
        </td>
      </tr>
    );
  },

});
