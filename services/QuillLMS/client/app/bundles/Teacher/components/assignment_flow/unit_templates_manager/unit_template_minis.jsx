import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router-dom'

import UnitTemplateMini from './unit_template_mini'

import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx'
import { DropdownInput } from '../../../../Shared/index'

const ALL = 'All'
const READABILITY_GRADE_LEVEL_LABELS = ['2nd-3rd', '4th-5th', '6th-7th', '8th-9th', '10th-12th']

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

  generateCategoryOptions(readabilityLevel, selectedTypeId) {
    const { data, } = this.props
    const categoryOrder = [ALL, 'Starter', 'Intermediate', 'Advanced', 'ELL', 'Diagnostic', 'Themed', 'Skill Practice']
    return categoryOrder.map((name) => {
      const category = data.categories.find(cat => cat.name === name)
      if (category) {
        category.label = category.name
        return {
          label: category.name,
          value: category.id,
          link: `${this.getIndexLink()}${this.generateQueryString(category, readabilityLevel, selectedTypeId)}`
        }
      } else {
        return {
          label: name,
          value: null,
          link: `${this.getIndexLink()}${this.generateQueryString(category, readabilityLevel, selectedTypeId)}`
        }
      }
    })
  }

  generateReadabilityOptions(currentCategory, selectedTypeId) {
    return [ALL].concat(READABILITY_GRADE_LEVEL_LABELS).map((level) => {
      if (level === ALL) {
        return {
          label: level,
          value: null,
          link: `${this.getIndexLink()}${this.generateQueryString(currentCategory, null, selectedTypeId)}`
        }
      }

      return {
        label: level,
        value: level,
        link: `${this.getIndexLink()}${this.generateQueryString(currentCategory, level, selectedTypeId)}`
      }
    })
  }

  generateShowAllGradesView() {
    const { data, } = this.props
    if (data.grade) {
      return (
        <Link className="see-all-activity-packs button-grey button-dark-grey text-center center-block show-all" to={this.getIndexLink()}>Show All Activity Packs</Link>
      )
    }
  }

  generateUnitTemplateView = (model, index) => {
    const { actions, signedInTeacher, } = this.props
    return (
      <UnitTemplateMini
        actions={actions}
        data={model}
        index={index}
        key={model.id}
        signedInTeacher={signedInTeacher}
      />
    )
  };

  generateUnitTemplateViews() {
    const { signedInTeacher, data, displayedModels, } = this.props;
    const { grade, } = data;
    let models;
    if (grade) {
      models = _.filter(displayedModels, (m) => {
        return _.contains(m.grades, grade.toString());
      });
    } else {
      models = displayedModels;
    }
    models = _.sortBy(models, 'order_number');
    if (signedInTeacher) {
      models = this.addCreateYourOwnModel(models);
    }
    const modelCards = models.map(this.generateUnitTemplateView);
    return modelCards;
  }

  userLoggedIn() {
    const { signedInTeacher, } = this.props
    return signedInTeacher
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
      case 'Whole class lessons':
        return 'Whole class lessons';
      case 'Independent practice':
        return 'Independent'
      default:
        return name;
    }
  }

  generateQueryString(category, readabilityLabel, typeId=null) {
    let qs = ''

    if (category) {
      qs = `?category=${category.label}`
    }

    if (readabilityLabel) {
      const readabilityQuery = `readability=${readabilityLabel}`
      qs+= qs.length ? `&${readabilityQuery}` : `?${readabilityQuery}`
    }

    if (typeId) {
      const typeQuery = `type=${typeId}`
      qs+= qs.length ? `&${typeQuery}` : `?${typeQuery}`
    }

    return qs
  }

  renderFilterOptions() {
    const { onMobile } = this.state
    const { types, selectedTypeId, data, selectCategory, selectReadability, } = this.props
    const categoryOptions = this.generateCategoryOptions(data.selectedReadabilityLevel, selectedTypeId)
    const currentCategory = categoryOptions.find(cat => cat.value && cat.value === data.selectedCategoryId)

    const readabilityOptions = this.generateReadabilityOptions(currentCategory, selectedTypeId)
    const currentReadability = readabilityOptions.find(cat => cat.value && cat.value === data.selectedReadabilityLevel)

    const baseLink = this.getIndexLink()

    const typeOptions = types.map(type => {
      const { id, name, } = type
      const qs = this.generateQueryString(currentCategory, data.selectedReadabilityLevel, id)
      return (
        <Link
          className={selectedTypeId === id ? 'active' : null}
          key={id}
          to={`${baseLink}${qs}`}
        >{name}</Link>
      )
    })

    const typeOptionsForDropdown = types.map(type => {
      const { id, name } = type;
      const qs = this.generateQueryString(currentCategory, data.selectedReadabilityLevel, id)
      return {
        label: this.getLabelName(name),
        value: `${baseLink}${qs}`
      }
    });
    typeOptionsForDropdown.unshift({ label: 'All packs', value: '/activities/packs' });

    const allPacksLink = (
      <Link
        className={!selectedTypeId ? 'active' : null}
        to={`${baseLink}${this.generateQueryString(currentCategory, data.selectedReadabilityLevel)}`}
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
        <div className="dropdowns">
          <DropdownInput
            className="readability-dropdown"
            handleChange={selectReadability}
            label="Readability grade level"
            options={readabilityOptions}
            value={currentReadability || readabilityOptions[0]}
          />
          <DropdownInput
            className="category-dropdown"
            handleChange={selectCategory}
            label="Pack type"
            options={categoryOptions}
            value={currentCategory || categoryOptions[0]}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='unit-template-minis-container' key='always-display'>
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
      </div>
    )
  }
}
