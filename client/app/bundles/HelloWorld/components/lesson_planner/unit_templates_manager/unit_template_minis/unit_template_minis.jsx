'use strict'

 import React from 'react'
 import { Link } from 'react-router'
 import UnitTemplateMini from './unit_template_mini/unit_template_mini'
 import ListFilterOptions from '../../../shared/list_filter_options/list_filter_options'
 import RowsCreator from '../../../modules/rows_creator'
 import _ from 'underscore'
 import _l from 'lodash'


 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
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
    models = _.sortBy(models, 'order_number');
    models = this.addCreateYourOwnModel(models);
    var rows = this.modules.rowsCreator.create(models);
    return <span>{rows}</span>;
  },

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel: function(models) {
    if (models && models.length) {
      models.push({id: 'createYourOwn', non_authenticated: this.props.data.non_authenticated});
      }
    return _l.uniqBy(models, 'id');
  },

  generateUnitTemplateView: function (model, index) {
    return <UnitTemplateMini key={model.id}
                                data={model}
                                index={index}
                                actions={this.props.actions}
                                signedInTeacher={this.props.signedInTeacher}/>
  },

  getIndexLink: function () {
    return this.props.signedInTeacher ? '/teachers/classrooms/assign_activities/featured-activity-packs' : '/activities/packs'
  },

  generateShowAllGradesView: function () {
    if (this.props.data.grade) {
      return (
        <Link to={this.getIndexLink()} className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all">Show All Activity Packs</Link>
      )
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
            <ListFilterOptions
                    key='listFilterOptions'
                    userLoggedIn={this.userLoggedIn()}
                    options={this.props.data.categories || []}
                    selectedId={this.props.data.selectedCategoryId}
                    // select={this.props.actions.filterByCategory}
                    />
      );
    }
  },

  userLoggedIn: function () {
    return this.props.signedInTeacher
  },

  userNotLoggedIn: function () {
    return !this.userLoggedIn();
  },
  renderTopLevelNav: function () {
    return this.listFilterOptions();
  },

  renderListFilterOptionsIfLoggedIn: function(){
    if (this.userLoggedIn()) {
      return (
        <div className='row'>
          {this.listFilterOptions()}
        </div>
      )
    }
  },

  stateSpecificComponents: function () {
    const components = [];
    if (this.userNotLoggedIn()) {
      components.push(this.renderTopLevelNav())
    }
    return (
      <div>
        {components.concat(this.alwaysRender())}
      </div>
    )
  },

  alwaysRender: function () {
    return (<div key='always-display' className='unit-template-minis'>
      <div className="container">
        <div className='row'>
          <div className='col-xs-12'>
              {this.renderListFilterOptionsIfLoggedIn()}
              {this.generateShowAllGradesView()}
            <div className='row'>
            {this.generateUnitTemplateViews()}
            </div>
            <div className='row'>
              {this.generateShowAllGradesView()}
            </div>
          </div>
        </div>
      </div>
    </div>)
  },

  render: function () {
    return this.stateSpecificComponents()
  }
});
