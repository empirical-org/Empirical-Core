import React from 'react'
import _ from 'underscore'
import _l from 'lodash'
import { Link } from 'react-router-dom'

import UnitTemplateMini from './unit_template_mini'
import UnitTemplateMinisTable from './unitTemplateMinisTable'

import AssignmentFlowNavigation from '../assignment_flow_navigation.tsx'
import { DropdownInput } from '../../../../Shared/index'
import { ACTIVITY_PACK_TYPES, READING_TEXTS, DIAGNOSTIC, WHOLE_CLASS_LESSONS, LANGUAGE_SKILLS, DAILY_PROOFREADING, CREATE_YOUR_OWN_ID } from '../assignmentFlowConstants'

const ALL = 'All'
const GRADE_LEVEL_LABELS = ['4th-12th', '6th-12th', '8th-12th', '10th-12th']
const GRID_VIEW_OPTION = { label: "Grid", value: "grid"}
const LIST_VIEW_OPTION = { label: "List", value: "list"}

export default class UnitTemplateMinis extends React.Component {

  state =  { onMobile: window.innerWidth < 770, currentView: GRID_VIEW_OPTION }

  getIndexLink() {
    const { signedInTeacher } = this.props;
    return signedInTeacher ? '/assign/featured-activity-packs' : '/activities/packs'
  }

  //adds a final model, which is simply flagged as a createYourOwn one via the key
  addCreateYourOwnModel(models) {
    const { data } = this.props;
    const { non_authenticated } = data;
    if (models && models.length) {
      models.push({id: 'createYourOwn', non_authenticated: non_authenticated, unit_template_category: null });
    }
    return _l.uniqBy(models, 'id');
  }

  generateCategoryOptions(gradeLevel, selectedTypeId) {
    const { data, } = this.props
    const usedCategories = Object.values(data.displayedModels).map(dm => dm.unit_template_category.name)
    const usedUniqueCategories = usedCategories.filter((v, i, a) => {
      if(!v) { return }
      return a.indexOf(v) === i
    })
    const sortedUsedCategories = usedUniqueCategories.sort((a,b) => (a && b) ? a.localeCompare(b) : (a < b) ? -1 : 1)
    const categoryOrder = [ALL].concat(sortedUsedCategories)
    return categoryOrder.map((name) => {
      const category = data.categories.find(cat => cat.name === name)
      if (category) {
        category.label = category.name
        return {
          label: category.name,
          value: category.id,
          link: `${this.getIndexLink()}${this.generateQueryString(category, gradeLevel, selectedTypeId)}`
        }
      } else {
        return {
          label: name,
          value: null,
          link: `${this.getIndexLink()}${this.generateQueryString(category, gradeLevel, selectedTypeId)}`
        }
      }
    })
  }

  generateGradeLevelOptions(currentCategory, selectedTypeId) {
    return [ALL].concat(GRADE_LEVEL_LABELS).map((level) => {
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
      <div className="unit-template-mini-wrapper">
        <UnitTemplateMini
          actions={actions}
          data={model}
          index={index}
          key={model.id}
          signedInTeacher={signedInTeacher}
        />
      </div>
    )
  };

  getModelCardsByType(models, type) {
    const filteredModels = models.filter(model => {
      const { unit_template_category, id } = model
      if(id === CREATE_YOUR_OWN_ID && type === WHOLE_CLASS_LESSONS)  {
        // we want to include the create your own pack card as the last card in the last section which is Whole Class Lessons
        return model
      }
      if(unit_template_category && type === LANGUAGE_SKILLS) {
        return ACTIVITY_PACK_TYPES.find(type => type.name === LANGUAGE_SKILLS).types.includes(unit_template_category.name)
      }
      if(!unit_template_category) { return }

      return unit_template_category.name === type
    })
    return filteredModels.map(this.generateUnitTemplateView);
  }

  generateUnitTemplateViews() {
    const { signedInTeacher, data, displayedModels, selectedTypeId } = this.props;
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
    if(!selectedTypeId) {
      const readingTextModels = this.getModelCardsByType(models, READING_TEXTS)
      const diagnosticModels = this.getModelCardsByType(models, DIAGNOSTIC)
      const languageSkillsModels = this.getModelCardsByType(models, LANGUAGE_SKILLS)
      const dailyProofreadingModels = this.getModelCardsByType(models, DAILY_PROOFREADING)
      const wholeClassModels = this.getModelCardsByType(models, WHOLE_CLASS_LESSONS)
      return(
        <React.Fragment>
          {!!readingTextModels.length && <section className="all-packs-section">
            <p className="pack-type-header">{READING_TEXTS}</p>
            <section className="packs-section">
              {readingTextModels}
            </section>
          </section>}
          {!!diagnosticModels.length && <section className="all-packs-section">
            <p className="pack-type-header">{DIAGNOSTIC}</p>
            <section className="packs-section">
              {diagnosticModels}
            </section>
          </section>}
          {!!languageSkillsModels.length && <section className="all-packs-section">
            <p className="pack-type-header">{LANGUAGE_SKILLS}</p>
            <section className="packs-section">
              {languageSkillsModels}
            </section>
          </section>}
          {!!dailyProofreadingModels.length && <section className="all-packs-section">
            <p className="pack-type-header">{DAILY_PROOFREADING}</p>
            <section className="packs-section">
              {dailyProofreadingModels}
            </section>
          </section>}
          {!!wholeClassModels.length && <section className="all-packs-section">
            <p className="pack-type-header">{WHOLE_CLASS_LESSONS}</p>
            <section className="packs-section">
              {wholeClassModels}
            </section>
          </section>}
        </React.Fragment>
      )
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
      return typeOptionsForDropdown[3];
    } else if(href.includes('independent')) {
      return typeOptionsForDropdown[2];
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

  generateQueryString(category, gradeLevel, typeId=null) {
    let qs = ''

    if (category) {
      qs = `?category=${category.label}`
    }

    if (gradeLevel) {
      const gradeLevelQuery = `gradeLevel=${gradeLevel}`
      qs+= qs.length ? `&${gradeLevelQuery}` : `?${gradeLevelQuery}`
    }

    if (typeId) {
      const typeQuery = `type=${typeId}`
      qs+= qs.length ? `&${typeQuery}` : `?${typeQuery}`
    }

    return qs
  }

  selectView(option) {
    this.setState({ currentView: option })
  }

  renderFilterOptions() {
    const { onMobile, currentView } = this.state
    const { types, selectedTypeId, data, selectCategory, selectGradeLevel, } = this.props
    const categoryOptions = this.generateCategoryOptions(data.selectedGradeLevel, selectedTypeId)
    const currentCategory = categoryOptions.find(cat => cat.value && cat.value === data.selectedCategoryId)

    const gradeLevelOptions = this.generateGradeLevelOptions(currentCategory, selectedTypeId)
    const currentGradeLevel = gradeLevelOptions.find(cat => cat.value && cat.value === data.selectedGradeLevel)

    const viewOptions = [GRID_VIEW_OPTION, LIST_VIEW_OPTION]

    const baseLink = this.getIndexLink()

    const typeOptions = types.map(type => {
      const { id, name, } = type
      const qs = this.generateQueryString(currentCategory, data.selectedGradeLevel, id)
      return (
        <Link
          className={`focus-on-light ${selectedTypeId === id ? 'active' : ''}`}
          key={id}
          to={`${baseLink}${qs}`}
        >{name}</Link>
      )
    })

    const typeOptionsForDropdown = types.map(type => {
      const { id, name } = type;
      const qs = this.generateQueryString(currentCategory, data.selectedGradeLevel, id)
      return {
        label: this.getLabelName(name),
        value: `${baseLink}${qs}`
      }
    });
    typeOptionsForDropdown.unshift({ label: 'All Packs', value: '/activities/packs' });

    const allPacksLink = (
      <Link
        className={`focus-on-light ${!selectedTypeId ? 'active' : null}`}
        to={`${baseLink}${this.generateQueryString(currentCategory, data.selectedGradeLevel)}`}
      >All Packs</Link>
    );

    const typeOptionsWidget = onMobile ? (
      <DropdownInput
        className="pack-type-dropdown"
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
        <div className="dropdowns">
          <DropdownInput
            className="grade-level-dropdown"
            handleChange={selectGradeLevel}
            label="Grade level range"
            options={gradeLevelOptions}
            value={currentGradeLevel || gradeLevelOptions[0]}
          />
          <DropdownInput
            className="category-dropdown"
            handleChange={selectCategory}
            label="Pack type"
            options={categoryOptions}
            value={currentCategory || categoryOptions[0]}
          />
          <DropdownInput
            className="category-dropdown"
            handleChange={(option) => this.selectView(option)}
            label="View"
            options={viewOptions}
            value={currentView || viewOptions[0]}
          />
        </div>
        {typeOptionsWidget}
      </div>
    )
  }

  renderActivityPacks() {
    const { displayedModels } = this.props;
    const { currentView } = this.state;
    const { value } = currentView;
    if(value === GRID_VIEW_OPTION.value) {
      return(
        <React.Fragment>
          <div className="unit-template-minis">
            {this.generateUnitTemplateViews()}
          </div>
          <div>
            {this.generateShowAllGradesView()}
          </div>
        </React.Fragment>
      )
    }
    if(value === LIST_VIEW_OPTION.value) {
      return(
        <React.Fragment>
          <UnitTemplateMinisTable unitTemplates={displayedModels} userSignedIn={this.userLoggedIn()} />
          <div>
            {this.generateShowAllGradesView()}
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <div className='unit-template-minis-container' key='always-display'>
        {this.userLoggedIn() ? <AssignmentFlowNavigation /> : null}
        <div className="container">
          <div>
            <h1>Select an activity pack for your students.</h1>
            <div>
              {this.renderFilterOptions()}
              {this.generateShowAllGradesView()}
              {this.renderActivityPacks()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
