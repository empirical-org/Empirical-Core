import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router-dom'

import UnitTemplateMini from './unit_template_mini'

import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx'
import { DropdownInput } from '../../../../Shared/index'

export default class UnitTemplateMinis extends React.Component {
  state =  { onMobile: window.innerWidth < 770 }
  getIndexLink() {
    const { signedInTeacher } = this.props;
    return signedInTeacher ? '/assign/featured-activity-packs' : '/activities/packs'
  }

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel(models) {
    const { data } = this.props;
    const { non_authenticated } = data;
    if (models && models.length) {
      models.push({id: 'createYourOwn', non_authenticated: non_authenticated});
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

  handleTypeDropdownChange(type) {
    const { value } = type;
    window.location.href = value;
  }

  getDropdownValue(typeOptionsForDropdown) {
    const { location } = window;
    const { href } = location;

    if(href.includes('diagnostic')) {
      return typeOptionsForDropdown[1];
    } else if(href.includes('whole-class')) {
      return typeOptionsForDropdown[2];
    } else if(href.includes('independent')) {
      return typeOptionsForDropdown[3];
    }
    return typeOptionsForDropdown[0];
  }

  getLabelName(name) {
    switch (name) {
      case 'Whole class + Independent practice':
        return 'Whole class + Independent';
      case 'Independent practice':
        return 'Independent'
      default:
        return name;
    }
  }

  renderFilterOptions() {
    const { onMobile } = this.state
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

    const typeOptionsForDropdown = types.map(type => {
      const { id, name } = type;
      const qs = currentCategory ? `?category=${currentCategory.label}&type=${id}` : `?type=${id}`
      return {
        label: this.getLabelName(name),
        value: `${baseLink}${qs}`
      }
    });
    typeOptionsForDropdown.unshift({ label: 'All packs', value: '/activities/packs' });

    const allPacksLink = (
      <Link
        className={!selectedTypeId ? 'active' : null}
        to={currentCategory ? `${baseLink}?category=${currentCategory.label}`: baseLink}
      >All packs</Link>
    );

    const typeOptionsWidget = onMobile ? (
      <DropdownInput
        handleChange={this.handleTypeDropdownChange}
        options={typeOptionsForDropdown}
        value={this.getDropdownValue(typeOptionsForDropdown)}
      />
    ) : (
      <div className='type-options'>
        {allPacksLink}
        {typeOptions}
      </div>
    )

    return (
      <div className="filter-options">
        {typeOptionsWidget}
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
