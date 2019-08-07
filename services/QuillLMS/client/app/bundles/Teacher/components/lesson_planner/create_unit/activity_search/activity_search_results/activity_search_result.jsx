import React from 'react';
import ReactTooltip from 'react-tooltip'

export default React.createClass({
  callToggleActivitySelection(e) {
    const true_or_false = ($(e.target).attr('checked') == 'checked');
    this.props.toggleActivitySelection(this.props.data, true_or_false);
  },
  render() {
    const selectedClass = this.props.selected ? 'selected' : '';
    const toolTip = this.props.data.activity_classification

    ? (<td className="activity_name">
        <a
          className="activity_link"
          href={this.props.data.anonymous_path}
          target="_new"
          data-tip={`<h1>${this.props.data.name}</h1><p>Tool: ${this.props.data.activity_classification.alias}</p><p>${this.props.data.section.name}</p><p>${this.props.data.topic_name}</p><p>${this.props.data.description}</p>`}
        >
          {this.props.data.name}
          <ReactTooltip html multiline className="react-tooltip-custom" type="light" effect="solid" />
        </a>
    </td>)
    : <span />;
    return (
      <tr onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className={`tooltip-trigger ${selectedClass}`}>
        <td>{this.props.data.activity_category ? this.props.data.activity_category.name : ''}</td>
        <td>
          <div className={`icon-${this.props.data.activity_classification.id}-green-no-border`} />
        </td>
        {toolTip}
        <td>
          <input type="checkbox" checked={this.props.selected} onChange={this.callToggleActivitySelection} id={`activity_${this.props.data.id}`} data-model-id={this.props.data.id} className="css-checkbox" />
          <label htmlFor={`activity_${this.props.data.id}`} id={`activity_${this.props.data.id}`} className="css-label" />
        </td>
      </tr>
    );
  },

});
