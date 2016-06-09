'use strict';
EC.UnitTemplatesManager = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  stageSpecificComponents: function () {
    var component;
    if (this.props.data.stage === 'index') {
      return <EC.UnitTemplateMinis data={this.props.data} actions={this.props.actions} />
    } else {
      return <EC.UnitTemplateProfile data={this.props.data} actions={this.props.actions} />
    }
  },

  render: function () {
    return (
      <div className='unit-templates-manager'>
        {this.stageSpecificComponents()}
      </div>
    );
  }
})