'use strict'
EC.CheckboxSection = React.createClass({
  propTypes: {
    checkboxes: React.PropTypes.array.isRequired
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

  actionButton: function(url){
    return <a className='btn btn-default' href={url}><div>
      <div>Launch</div>
      <div className='favicon-div'><i className="fa fa-long-arrow-right" aria-hidden="true"></i></div>
    </div>
  </a>
  },


  optionalInfo: function(box){
    var info = [];
    if (box.help_info) {
      info.push(<td className='text-right help-info'><a href={box.help_info}>View the Guide</a></td>);
    }
    if (box.action_url){
      info.push(<td className='text-right url-action'>{this.actionButton(box.action_url)}</td>);
    }
    return info;
  },

  section: function(){
    var that = this;
    var category = this.props.checkboxes[0].section || 'Miscellaneous';
    var boxes = this.props.checkboxes.map(box =>
      <tr key={box.id} className={'completed-' + box.completed}>
        <td className='check-or-number'>{that.checkOrNumber(box)}</td>
        <td className='text-left'>{box.name}</td>
        {this.optionalInfo(box)}
      </tr>
    );
    return (
      <div>
        <h3>{category}</h3>
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
