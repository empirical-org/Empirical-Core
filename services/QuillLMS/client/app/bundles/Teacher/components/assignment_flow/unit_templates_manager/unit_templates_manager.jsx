import React from 'react'
import _l from 'lodash'
import _ from 'underscore'
import UnitTemplateMinis from './unit_template_minis'
import ScrollToTop from '../../shared/scroll_to_top'
import fnl from '../../modules/fnl'
import updaterGenerator from '../../modules/updater'
import getParameterByName from '../../modules/get_parameter_by_name';
import WindowPosition from '../../modules/windowPosition'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import LoadingIndicator from '../../shared/loading_indicator'
import { requestGet } from '../../../../../modules/request';

const types = [
  {
    name: 'Diagnostic',
    id: 'diagnostic'
  },
  {
    name: 'Whole class + Independent practice',
    id: 'whole-class'
  },
  {
    name: 'Independent practice',
    id: 'independent-practice'
  }
]

export default class UnitTemplatesManager extends React.Component {
  constructor(props) {
    super(props)

    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      windowPosition: new WindowPosition()
    }

    this.state = {
      signedInTeacher: false,
      unitTemplatesManager: {
        firstAssignButtonClicked: false,
        assignSuccess: false,
        models: [],
        categories: [],
        stage: 'index', // index, profile,
        model: null,
        model_id: null,
        relatedModels: [],
        selectedCategoryId: null,
        lastActivityAssigned: null,
        grade: getParameterByName('grade'),
      }
    }

    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');
    this.updateUnitTemplateModels = this.updateUnitTemplateModels.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.filterModels = this.filterModels.bind(this)
  }

  componentDidMount() {
    this.fetchUnitTemplateModels();
    this.fetchTeacher();
  }

  analytics() {
    return new AnalyticsWrapper();
  }

  unitTemplatesManagerActions() {
    return {
      toggleTab: this.toggleTab,
      clickAssignButton: this.clickAssignButton,
      returnToIndex: this.returnToIndex,
      selectModel: this.selectModel,
      showAllGrades: this.showAllGrades
    };
  }

  modelsInGrade(grade) {
    return _.reject(this.state.unitTemplatesManager.models, (m) => {
      return _.indexOf(m.grades, grade)
    });
  }

  updateUnitTemplateModels(models) {
    const categories = _.chain(models).pluck('unit_template_category').uniq(_.property('id')).value();
    const newHash = {
      models,
      displayedModels: models,
      categories
    }
    const modelId = this.state.unitTemplatesManager.model_id // would be set if we arrived here from a deep link
    if (modelId) {
      newHash.model = _.findWhere(models, {id: model_id});
      newHash.stage = 'profile'
    }
    this.updateUnitTemplatesManager(newHash)

    const { category, grade, type, } = this.props.location.query
    if (category || grade || type) {
      this.filterModels(category, grade, type)
    }
  }

  returnToIndex() {
    this.updateUnitTemplatesManager({ stage: 'index' })
    window.scrollTo(0, 0);
  }

  showAllGrades() {
    this.updateUnitTemplatesManager({grade: null});
    window.scrollTo(0, 0);
  }

  filterModels(category, grade, typeId) {
    const { unitTemplatesManager, } = this.state
    let displayedModels = unitTemplatesManager.models
    let selectedCategoryId
    if (grade) {
      displayedModels = this.modelsInGrade(grade)
    }
    if (category) {
      const categoryName = category.toUpperCase() === 'ELL' ? category.toUpperCase() : _l.capitalize(category)
      selectedCategoryId = unitTemplatesManager.categories.find(cat => cat.name === categoryName).id
      displayedModels = displayedModels.filter(ut =>
        ut.unit_template_category.name === categoryName
      )
    }
    if (typeId) {
      const selectedTypeName = types.find(t => t.id === typeId).name
      displayedModels = displayedModels.filter(ut => ut.type.name === selectedTypeName)
    }
    return displayedModels
  }

  fetchClassrooms() {
    requestGet('/teachers/classrooms/retrieve_classrooms_for_assigning_activities', (data) => {
      this.updateCreateUnit({
        options: {
          classrooms: data.classrooms_and_their_students
        }
      })
    })
  }

  fetchTeacher() {
    requestGet('/current_user_json', (data) => {
      this.setTeacher(data)
    })
  }

  setTeacher(data) {
    this.setState({
      signedInTeacher: !_l.isEmpty(data)
    })
  }

  fetchUnitTemplateModels() {
    requestGet('/teachers/unit_templates', (data) => {
      this.updateUnitTemplateModels(data.unit_templates)
    })
  }

  toggleTab(tab) {
    if (tab === 'createUnit') {
      this.analytics().track('click Create Unit', {});
      this.updateCreateUnit({
        stage: 1,
        model: {
          name: null,
          selectedActivities: []
        }
      });

      this.setState({tab: tab});
    } else {
      this.setState({tab: tab});
    }
  }

  selectCategory(category) {
    this.props.router.push(category.link)
  }

  showUnitTemplates() {
    if (this.state.unitTemplatesManager.models.length < 1) {
      return <LoadingIndicator />
    }

    const { category, grade, type, } = this.props.location.query
    const displayedModels = this.filterModels(category, grade, type)
    return (<UnitTemplateMinis
      actions={this.unitTemplatesManagerActions()}
      data={this.state.unitTemplatesManager}
      displayedModels={displayedModels}
      selectCategory={this.selectCategory}
      selectedTypeId={type}
      signedInTeacher={this.state.signedInTeacher}
      types={types}
    />)
  }

  render() {
    return (
      <span>
        <ScrollToTop />
        <div className='unit-templates-manager'>
          {this.showUnitTemplates()}
        </div>
      </span>
    );
  }
}
