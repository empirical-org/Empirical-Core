import React from 'react'

export default class SelectedActivity extends React.Component {
  deselectActivity = () => {
    this.props.toggleActivitySelection(this.props.data, false);
  };

  render() {
    const classification = this.props.data.activity_classification || this.props.data.classification
    return (
      <tr data-model-id={this.props.data.id}>
        <td className={classification ? `icon-${classification.id}-green-no-border` : ''} />
        <td>
          <a className='activity_link' href={this.props.data.anonymous_path} target='_new'>
            {this.props.data.name}
          </a>
        </td>
        <td className='deselect-activity' data-model-id={this.props.data.id} onClick={this.deselectActivity}><img src="/images/x.svg" /></td>
      </tr>
    );
  }
}
