'use strict';
EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  stageSpecificComponents: function () {
  },

  render: function () {
    return (
      <div className='successBox'>
        <div className='messageBox'><h2>Success</h2></div>
        <p>You've assigned an activity-pack to your class!</p>
        <p>Your next step is to add students.</p>
        <div  className= "create-unit-button-container">
            <button onClick={this.switchToCreateUnit} className="button-green create-unit">Create a New Unit</button>
        </div>
      </div>
    );
  }
});
