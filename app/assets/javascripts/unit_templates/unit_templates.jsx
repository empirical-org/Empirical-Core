'use strict';
$(function () {
  var ele = $('#unit-templates');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.UnitTemplates, props);
    React.render(comp, ele[0]);
  }
});



EC.UnitTemplates = React.createClass({

  getInitialState: function () {
    this.initializeModules()
    return ({
      models: []
    })
  },

  initializeModules: function () {
    var server = new EC.Server('unit_template', 'unit_templates');
    server.setUrlPrefix('/teachers');
    this.modules = {
      server: server
    }
  },

  componentDidMount: function () {
    this.modules.server.getModels(this.updateModels);
  },

  updateModels: function (models) {
    this.setState({models: models});
  },

  generateUnitTemplateViews: function () {
    return _.map(this.state.models, this.generateUnitTemplateView, this);
  },

  generateUnitTemplateView: function (model) {
    return <EC.UnitTemplate data={model} />
  },

  render: function () {
    return (
      <div>
        {this.generateUnitTemplateViews()}
      </div>
    );
  }
})