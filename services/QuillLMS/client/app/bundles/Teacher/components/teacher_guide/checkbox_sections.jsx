import React from 'react'

export default class CheckboxSections extends React.Component {
  checkOrNumber = (box) => {
    return box.completed ? this.checkboxElement() : this.placementNum(box);
  };

  placementNum = (box) => {
    return <div className='placement-number'><span>{box.section_placement}</span></div>
  };

  checkboxElement = () => {
    return <div className='image-wrapper'><img alt="" src='/images/teacher-guide-check.png' /></div>
  };

  pageBasedActionIcon = (url) => {
    if (this.props.dashboard) {
      return (<a href={url}><img alt="" src='/images/getting_started_arrow.png' /></a>);
    } else {
      return (
        <a className='btn btn-default' href={url}><div>
          <div>Launch</div>
          <div className='favicon-div'><i aria-hidden="true" className="fas fa-long-arrow-alt-right" /></div>
        </div>
        </a>
      );
    }
  };

  pageBasedHelpInfo = (url) => {
    let text = this.props.dashboard ? 'Guide' : 'View the Guide'
    return <a href={url}>{text}</a>
  };

  actionButton = (url) => {
    return this.pageBasedActionIcon(url);
  };

  optionalInfo = (box) => {
    let info = [];
    if (box.help_info) {
      info.push(<td className='text-right help-info' key={'help-info ' + box.action_url}>{this.pageBasedHelpInfo(box.help_info)}</td>);
    }
    if (box.action_url){
      info.push(<td className='text-right url-action' key={'action ' + box.action_url}>{this.actionButton(box.action_url)}</td>);
    }
    return info;
  };

  category = () => {
    if (!this.props.dashboard){
      return <h3>{this.props.checkboxes[0].section || 'Miscellaneous'}</h3>
    }
  };

  sortBoxes = () => {
    return this.props.checkboxes.sort((a,b) => a.section_placement - b.section_placement);
  };

  section = () => {
    let that = this;
    let boxes = this.sortBoxes().map(box =>
      (<tr className={'completed-' + box.completed} key={box.id}>
        <td className='check-or-number'>{that.checkOrNumber(box)}</td>
        <td className='text-left'><a href={box.action_url}>{box.name}</a></td>
        {this.optionalInfo(box)}
      </tr>)
    );
    return (
      <div>
        {this.category()}
        <table className='table quill-table'>
          <tbody>
            {boxes}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    return this.section();
  }
}
