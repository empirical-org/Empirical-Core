'use strict'
EC.TeacherGuide = React.createClass({
  propTypes: {
    checkboxData: React.PropTypes.object.isRequired
  },

  groupBySectionAndCompleted: function(){
    var grouping = {};
    var data = this.props.checkboxData;
    data.potential.forEach(function(objective){
      // shows whether the objective has a corresponding completed checkbox
      objective.completed = _.contains(data.completed, objective.id);
      if (!grouping[objective.section]) {
        grouping[objective.section] = [objective];
      } else {
        grouping[objective.section].push(objective);
      }
    });
    return grouping;
  },

  sectionPart: function(){
    var display = [];
    var sections = this.groupBySectionAndCompleted();
    for (var sect in sections){
      display.push(<EC.CheckboxSection checkboxes={sections[sect]}/>);
    }
    return display;
  },

  introCopy: function(){
   return (
     <div className='summary intro-copy'>
       <h2>Complete these quests and become a Quill guru!</h2>
       <p>Quill is very simple on the surface. Find activities and assign them to your students. But underneath, there all kinds of power features that help you create custom activity packs, view in-depth reports and assign activities faster. Let’s take a look!</p>
       </div>
   )
  },

  render: function() {
    return (<div id='teacher-guide'>
      {this.introCopy()}
      {this.sectionPart()}
    </div>);
  }


});
