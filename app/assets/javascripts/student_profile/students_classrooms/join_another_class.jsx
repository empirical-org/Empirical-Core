$(function () {
  var ele = $('#add-additional-class')[0]
  if (ele) {
    React.render(React.createElement(EC.JoinAnotherClass), ele)
  }
});

'use strict'
EC.JoinAnotherClass = React.createClass({

  getInitialState: function() {
    return ({stage: 1});
  },

  advanceStage: function() {
    this.setState({stage: 2});
  },

  stateSpecificComponents: function() {
    if (this.state.stage === 1) {
      return <EC.JoinClassStage1 advanceStage={this.advanceStage}/>;
    } else {
      return <EC.JoinClassStage2/>;
    }
  },


  render: function() {
    return (this.stateSpecificComponents());
  }
});
