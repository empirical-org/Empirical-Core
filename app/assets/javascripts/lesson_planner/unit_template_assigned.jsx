'use strict';
EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  stageSpecificComponents: function () {
    alert('I"M RENDERING!!!');
  },

  render: function () {
    return (
      <h1>REND</h1>
    );
  }
});
