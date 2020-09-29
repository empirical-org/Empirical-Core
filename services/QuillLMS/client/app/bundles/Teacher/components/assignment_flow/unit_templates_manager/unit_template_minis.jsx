import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router-dom'
import { DropdownInput } from '../../../../Shared/index'

import UnitTemplateMini from './unit_template_mini'
import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx'

export default class UnitTemplateMinis extends React.Component {
  getIndexLink() {
    return this.props.signedInTeacher ? '/assign/featured-activity-packs' : '/activities/packs'
  }

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel(models) {
    if (models && models.length) {
      models.push({id: 'createYourOwn', non_authenticated: this.props.data.non_authenticated});
    }
    return _l.uniqBy(models, 'id');
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

  generateShowAllGradesView() {
    if (this.props.data.grade) {
      return (
        <Link className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all" to={this.getIndexLink()}>Show All Activity Packs</Link>
      )
    }
  }

  generateUnitTemplateView = (model, index) => {
    return (<UnitTemplateMini
      actions={this.props.actions}
      data={model}
      index={index}
      key={model.id}
      signedInTeacher={this.props.signedInTeacher}
    />)
  };

  generateUnitTemplateViews() {
    const { grade, } = this.props.data;
    const { signedInTeacher, } = this.props;
    let models;
    if (grade) {
      models = _.filter(this.props.displayedModels, (m) => {
        return _.contains(m.grades, grade.toString());
      });
    } else {
      models = this.props.displayedModels;
    }
    models = _.sortBy(models, 'order_number');
    if (signedInTeacher) {
      models = this.addCreateYourOwnModel(models);
    }
    const modelCards = models.map(this.generateUnitTemplateView);
    return modelCards;
  }

  userLoggedIn() {
    return this.props.signedInTeacher
  }

  userNotLoggedIn() {
    return !this.userLoggedIn();
  }

  renderFilterOptions() {
    const { types, selectedTypeId, data, selectCategory, } = this.props
    const categoryOptions = this.generateCategoryOptions()

    const currentCategory = categoryOptions.find(cat => cat.value && cat.value === data.selectedCategoryId)
    const baseLink = this.getIndexLink()

    const typeOptions = types.map(type => {
      const { id, name, } = type
      const qs = currentCategory ? `?category=${currentCategory.label}&type=${id}` : `?type=${id}`
      return (<Link
        className={selectedTypeId === id ? 'active' : null}
        to={`${baseLink}${qs}`}
      >{name}</Link>)
    })

    return (
      <div className="filter-options">
        <div className='type-options'>
          <Link
            className={!selectedTypeId ? 'active' : null}
            to={currentCategory ? `${baseLink}?category=${currentCategory.label}`: baseLink}
          >All packs</Link>
          {typeOptions}
        </div>
        <DropdownInput
          handleChange={selectCategory}
          options={categoryOptions}
          value={currentCategory || categoryOptions[0]}
        />
      </div>
    )
  }

  render() {
    return (<div className='unit-template-minis-container' key='always-display'>
      {this.userLoggedIn() ? <AssignmentFlowNavigation /> : null}
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
