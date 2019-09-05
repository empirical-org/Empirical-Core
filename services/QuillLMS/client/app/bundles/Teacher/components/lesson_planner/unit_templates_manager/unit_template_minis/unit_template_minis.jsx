import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router'

import UnitTemplateMini from './unit_template_mini/unit_template_mini'
import ListFilterOptions from '../../../shared/list_filter_options/list_filter_options'

export default class UnitTemplateMinis extends React.Component {
  constructor(props) {
    super(props)

    this.generateUnitTemplateView = this.generateUnitTemplateView.bind(this)
  }

  generateUnitTemplateViews() {
    const { grade, } = this.props.data;
    let models;
    if (grade) {
      models = _.filter(this.props.data.displayedModels, (m) => {
        return _.contains(m.grades, grade.toString());
      });
    } else {
      models = this.props.data.displayedModels;
    }
    models = _.sortBy(models, 'order_number');
    models = this.addCreateYourOwnModel(models);
    const modelCards = models.map((model, i) => this.generateUnitTemplateView(model, i));
    return modelCards;
  }

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel(models) {
    if (models && models.length) {
      models.push({id: 'createYourOwn', non_authenticated: this.props.data.non_authenticated});
    }
    return _l.uniqBy(models, 'id');
  }

  generateUnitTemplateView(model, index) {
    return (<UnitTemplateMini
      key={model.id}
      data={model}
      index={index}
      actions={this.props.actions}
      signedInTeacher={this.props.signedInTeacher}
    />)
  }

  getIndexLink() {
    return this.props.signedInTeacher ? '/teachers/classrooms/assign_activities/featured-activity-packs' : '/activities/packs'
  }

  generateShowAllGradesView() {
    if (this.props.data.grade) {
      return (
        <Link to={this.getIndexLink()} className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all">Show All Activity Packs</Link>
      )
    }
  }

  renderListFilterOptions(){
    return (
      <div className='row'>
        {this.listFilterOptions()}
      </div>
    )
  }

  listFilterOptions() {
    if (this.props.data.grade) {
      return null
    }
    return (<ListFilterOptions
      key='listFilterOptions'
      userLoggedIn={this.userLoggedIn()}
      options={this.props.data.categories || []}
      selectedId={this.props.data.selectedCategoryId}
    />);
  }

  userLoggedIn() {
    return this.props.signedInTeacher
  }

  userNotLoggedIn() {
    return !this.userLoggedIn();
  }

  render() {
    return (<div key='always-display' className='unit-template-minis-container'>
      <div className="container">
        <div>
          <div>
            {this.renderListFilterOptions()}
            {this.generateShowAllGradesView()}
            <div className="unit-template-minis">
              {this.generateUnitTemplateViews()}
            </div>
            <div>
              {this.generateShowAllGradesView()}
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}
