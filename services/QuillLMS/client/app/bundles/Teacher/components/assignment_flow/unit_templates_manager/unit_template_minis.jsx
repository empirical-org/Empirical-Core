import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router'
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

import UnitTemplateMini from './unit_template_mini'

export default class UnitTemplateMinis extends React.Component {
  constructor(props) {
    super(props)

    this.generateUnitTemplateView = this.generateUnitTemplateView.bind(this)
  }

  generateUnitTemplateViews() {
    const { grade, } = this.props.data;
    let models;
    if (grade) {
      models = _.filter(this.props.displayedModels, (m) => {
        return _.contains(m.grades, grade.toString());
      });
    } else {
      models = this.props.displayedModels;
    }
    models = _.sortBy(models, 'order_number');
    models = this.addCreateYourOwnModel(models);
    const modelCards = models.map(this.generateUnitTemplateView);
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
      actions={this.props.actions}
      data={model}
      index={index}
      key={model.id}
      signedInTeacher={this.props.signedInTeacher}
    />)
  }

  getIndexLink() {
    return this.props.signedInTeacher ? '/teachers/classrooms/assign_activities/featured-activity-packs' : '/activities/packs'
  }

  generateShowAllGradesView() {
    if (this.props.data.grade) {
      return (
        <Link className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all" to={this.getIndexLink()}>Show All Activity Packs</Link>
      )
    }
  }

  generateCategoryOptions() {
    const { data, } = this.props
    const categoryOrder = ['All levels', 'Starter', 'Intermediate', 'Advanced', 'ELL']
    return categoryOrder.map((name) => {
      const category = data.categories.find(cat => cat.name === name)
      if (category) {
        return {
          label: category.name,
          value: category.id,
          link: `${this.getIndexLink()}?category=${category.name}`
        }
      } else {
        return {
          label: name,
          value: null,
          link: this.getIndexLink()
        }
      }
    })
  }

  renderFilterOptions() {
    const { types, selectedTypeId, data, selectCategory, } = this.props
    const typeOptions = types.map(type => <Link
      className={selectedTypeId === type.id ? 'active' : null}
      to={`${this.getIndexLink()}?type=${type.id}`}
    >{type.name}</Link>)
    const categoryOptions = this.generateCategoryOptions()
    return (
      <div className="filter-options">
        <div className='type-options'>
          <Link className={!selectedTypeId ? 'active' : null} to={this.getIndexLink()}>All packs</Link>
          {typeOptions}
        </div>
        <DropdownInput
          handleChange={selectCategory}
          options={categoryOptions}
          value={categoryOptions.find(cat => cat.value === data.selectedCategoryId) || categoryOptions[0]}
        />
      </div>
    )
  }

  userLoggedIn() {
    return this.props.signedInTeacher
  }

  userNotLoggedIn() {
    return !this.userLoggedIn();
  }

  render() {
    return (<div className='unit-template-minis-container' key='always-display'>
      <div className="container">
        <div>
          <h1>Select an activity pack for your students</h1>
          <div>
            {this.renderFilterOptions()}
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
