'use strict';
$(function () {
  var ele = $('#cms-unit-templates');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.UnitTemplatesCms, props);
    React.render(comp, ele[0]);
  }
});

EC.UnitTemplatesCms = React.createClass({

  getInitialState: function () {
    return {
      crudState: 'index',
      unitTemplates: [],
      unitTemplateToEdit: null
    }
  },

  componentDidMount: function () {
    if (this.state.crudState == 'index') {
      $.get('/cms/unit_templates', {}, this.loadUnitTemplates, 'json')
    }
  },

  loadUnitTemplates: function (data) {
    this.setState({unitTemplates: data.unit_templates});
  },

  indexTable: function () {
    return (
      <span>
        <div className='row'>
          <div className='col-xs-12'>
            <button className='button-green button-top' onClick={this.crudNew}>New</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <EC.CmsIndexTable resources={this.state.unitTemplates}
                              edit={this.edit}
                              delete={this.delete}/>
          </div>
        </div>
      </span>
    );
  },

  returnToIndex: function () {
    this.setState({crudState: 'index'});
  },

  editMode: function () {
    return (
      <EC.UnitTemplate unitTemplate={this.state.unitTemplateToEdit}
                       returnToIndex={this.returnToIndex}/>
    );
  },

  newMode: function () {
    return (
      <span>new time</span>
    );
  },

  edit: function (unitTemplate) {
    this.setState({crudState: 'edit', unitTemplateToEdit: unitTemplate});
  },

  delete: function () {
    alert('delete')
  },

  crudNew: function () {
    this.setState({crudState: 'new'});
  },

  render: function () {
    var result;
    switch (this.state.crudState) {
      case 'index':
        result = this.indexTable();
        break;
      case 'edit':
        result = this.editMode();
        break;
      case 'new':
        result = this.newMode();
        break;
    }

    return result;
  }

});