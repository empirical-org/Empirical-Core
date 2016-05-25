'use strict'
EC.TeacherGuide = React.createClass({
  propTypes: {
    checkboxData: React.PropTypes.object,
    dashboardMini: React.PropTypes.bool.isRequired
  },

  getInitialState: function(){
    var state = {necessary: true};
    if (this.props.dashboardMini) {
      state.loading = true;
      state.dashboard = true;
    } else {
      state.checkboxData = this.props.checkboxData;
    }
    return state;
  },

  componentDidMount: function(){
    this.getInitialState();
    var that = this;
    if (!this.state.checkboxData) {
      $.get('/teachers/getting_started', function( data ) {
        that.setState({checkboxData: data,
                       necessary: data.necessary || true,
                       loading: false
        });
      });
    }

  },

  groupBySectionAndCompleted: function(){
    var grouping = {};
    var data = this.state.checkboxData;
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

  stateSpecificComponents: function(){
    if (this.state.loading) {
      return <div>LOADING</div>
    }
    else if (!this.state.necessary) {
      return (<span/>);
    }
    else if (this.state.dashboardMini) {
      return <EC.GettingStartedMini checkboxData={this.groupBySectionAndCompleted()}/>;
    } else {
      return (
        [this.introCopy(), this.sectionPart()]
      );
    }
  },

  render: function() {
    return (<div id='teacher-guide'>
      {this.stateSpecificComponents()}
    </div>);
  }


});
