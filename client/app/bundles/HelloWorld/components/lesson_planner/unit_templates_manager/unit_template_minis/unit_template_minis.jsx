'use strict'

 import React from 'react'
 import UnitTemplateMini from './unit_template_mini/unit_template_mini'
 import ListFilterOptions from '../../../shared/list_filter_options/list_filter_options'
 import UnitTemplateMinisHeader from './unit_template_minis_header'
 import RowsCreator from '../../../modules/rows_creator'


 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.modules = {
      rowsCreator: new RowsCreator(this.colView, this.rowView, 2)
    }
    return {};
  },

  generateUnitTemplateViews: function () {
    var grade = this.props.data.grade;
    var models;
    if (grade) {
      models = _.filter(this.props.data.displayedModels, function (m){
        return _.contains(m.grades, grade.toString());
      });
    } else {
      models = this.props.data.displayedModels;
    }
    models = this.addCreateYourOwnModel(models);
    var rows = this.modules.rowsCreator.create(models);
    return <span>{rows}</span>;
  },

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel: function(models) {
    if (models && models.length) {
      models.push({id: 'createYourOwn'});
      }
    return models;
  },

  generateUnitTemplateView: function (model, index) {
    return <UnitTemplateMini key={model.id}
                                data={model}
                                index={index}
                                actions={this.props.actions} />
  },

  generateShowAllGradesView: function () {
    if (this.props.data.grade) {
      return (
        <button className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all" onClick={this.props.actions.showAllGrades}>Show all Activity Packs</button>
      )
    } else {
      return
    }
  },

  colView: function (data, index) {
    var className;
    if (index === 0) {
      className = 'col-sm-6 col-xs-12 no-pr'
    } else {
      className = 'col-sm-6 col-xs-12 no-pl'
    }
    return (
      <div className={className} key={index}>
        {this.generateUnitTemplateView(data, index)}
      </div>
    );
  },

  rowView: function (cols, index) {
    return <div className='row' key={index}>{cols}</div>;
  },

  listFilterOptions: function () {
    if (this.props.data.grade) {
      return
    }
    else {
      return (
          <div className='list-filter-options-container'>
            <ListFilterOptions
                    options={this.props.data.categories || []}
                    selectedId={this.props.data.selectedCategoryId}
                    select={this.props.actions.filterByCategory} />
          </div>
      );
    }
  },

  render: function () {
    return (
      <div className='unit-template-minis'>
        <UnitTemplateMinisHeader data={this.props.data} />
        <div className="container">
          <div className='row'>
            <div className='col-xs-12'>
              <div className='row'>
                {this.listFilterOptions()}
              </div>
              <div className='row'>
                {this.generateUnitTemplateViews()}
              </div>
              <div className='row'>
                {this.generateShowAllGradesView()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
