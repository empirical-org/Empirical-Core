'use strict'
import React from 'react'
export default React.createClass({
  propTypes: {
    checkboxes: React.PropTypes.array.isRequired,
    dashboard: React.PropTypes.bool.isRequired
  },

  checkOrNumber: function(box){
    return box.completed ? this.checkboxElement() : this.placementNum(box);
  },

  placementNum: function(box) {
    return <div className='placement-number'><span>{box.section_placement}</span></div>
  },

  checkboxElement: function() {
    return <div className='image-wrapper'><img src='/images/teacher-guide-check.png'/></div>
  },

  pageBasedActionIcon: function(url) {
    if (this.props.dashboard) {
      return (<a href={url}><img src='/images/getting_started_arrow.png'/></a>);
    } else {
      return (<a className='btn btn-default' href={url}><div>
           <div>Launch</div>
           <div className='favicon-div'><i className="fa fa-long-arrow-right" aria-hidden="true"></i></div>
         </div>
       </a>);
    }
  },

  pageBasedHelpInfo: function(url) {
    var text = this.props.dashboard ? 'Guide' : 'View the Guide'
    return <a href={url}>{text}</a>
  },



  actionButton: function(url){
    return this.pageBasedActionIcon(url);
  },


  optionalInfo: function(box){
    var info = [];
    if (box.help_info) {
      info.push(<td key={'help-info ' + box.action_url} className='text-right help-info'>{this.pageBasedHelpInfo(box.help_info)}</td>);
    }
    if (box.action_url){
      info.push(<td key={'action ' + box.action_url} className='text-right url-action'>{this.actionButton(box.action_url)}</td>);
    }
    return info;
  },

  category: function(){
    if (!this.props.dashboard){
      return <h3>{this.props.checkboxes[0].section || 'Miscellaneous'}</h3>
  }
},

sortBoxes: function(){
  return this.props.checkboxes.sort((a,b) => a.section_placement - b.section_placement);
},



  section: function(){
    var that = this;
    var boxes = this.sortBoxes().map(box =>
      <tr key={box.id} className={'completed-' + box.completed}>
        <td className='check-or-number'>{that.checkOrNumber(box)}</td>
        <td className='text-left'><a href={box.action_url}>{box.name}</a></td>
        {this.optionalInfo(box)}
      </tr>
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
  },

  render: function() {
    return this.section();
  }

});
