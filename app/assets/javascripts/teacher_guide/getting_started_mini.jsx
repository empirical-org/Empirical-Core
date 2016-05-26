'use strict'
EC.GettingStartedMini = React.createClass({
  propTypes: {
    checkboxData: React.PropTypes.object.isRequired
  },

  percentageCompleted: function(){
    var boxes = this.props.checkboxData;
    var ratio = boxes.filter(obj => obj.completed === true).length / boxes.length;
    var percentage = Math.floor(ratio * 100);
    return percentage;
  },

  graphSection: function(){
    return (
      <div id='graph-section'>
        <h3>Getting Started</h3>
        <EC.PercentageGraph percentage={this.percentageCompleted()}/>
        <a className='green-link' href='/teachers/teacher_guide'>View All Tasks ></a>
      </div>);
  },

  checklistSection: function() {
    return <EC.CheckboxSection checkboxes={this.props.checkboxData} dashboard={true}/>
  },

  render: function() {
    return (
      <div className='mini-content'>
      <div className='row'>
        <div className='col-sm-4'>
          {this.graphSection()}
      </div>
      <div className='col-sm-8'>
          {this.checklistSection()}
      </div>
    </div>
    </div>
  );

  }



});
