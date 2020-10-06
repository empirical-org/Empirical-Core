import React from 'react';
import ReactTooltip from 'react-tooltip'

export default class ActivitySearchResult extends React.Component {
  callToggleActivitySelection = (e) => {
    const true_or_false = ($(e.target).attr('checked') == 'checked');
    this.props.toggleActivitySelection(this.props.data, true_or_false);
  };

  render() {
    const selectedClass = this.props.selected ? 'selected' : '';
    const toolTip = this.props.data.activity_classification

    ? (<td className="activity_name">
      <a
        className="activity_link"
        data-tip={`<h1>${this.props.data.name}</h1><p>Tool: ${this.props.data.activity_classification.alias}</p><p>${this.props.data.standard_level.name}</p><p>${this.props.data.standard_name}</p><p>${this.props.data.description}</p>`}
        href={this.props.data.anonymous_path}
        target="_new"
      >
        {this.props.data.name}
        <ReactTooltip className="react-tooltip-custom" effect="solid" html multiline type="light" />
      </a>
    </td>)
    : <span />;
    return (
      <tr className={`tooltip-trigger ${selectedClass}`} onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop}>
        <td>{this.props.data.activity_category ? this.props.data.activity_category.name : ''}</td>
        <td>
          <div className={`icon-${this.props.data.activity_classification.id}-green-no-border`} />
        </td>
        {toolTip}
        <td>
          <input checked={this.props.selected} className="css-checkbox" data-model-id={this.props.data.id} id={`activity_${this.props.data.id}`} onChange={this.callToggleActivitySelection} type="checkbox" />
          <label className="css-label" htmlFor={`activity_${this.props.data.id}`} id={`activity_${this.props.data.id}`} />
        </td>
      </tr>
    );
  }
}
