import React from 'react'
import _l from 'lodash'
import _ from 'underscore'
import qs from 'qs'

import UnitTemplateMinis from './unit_template_minis'

import ScrollToTop from '../../shared/scroll_to_top'
import fnl from '../../modules/fnl'
import updaterGenerator from '../../modules/updater'
import getParameterByName from '../../modules/get_parameter_by_name';
import WindowPosition from '../../modules/windowPosition'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import LoadingIndicator from '../../shared/loading_indicator'
import { requestGet } from '../../../../../modules/request';
import { ACTIVITY_PACK_TYPES } from '../assignmentFlowConstants'

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
        selectedGradeLevel: null,
        lastActivityAssigned: null,
        grade: getParameterByName('grade'),
      }
    }

    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');
  }

  componentDidMount() {
    this.fetchUnitTemplateModels();
    this.fetchTeacher();
  }

  parsedQueryParams = () => {
    const { location, } = this.props
    return qs.parse(location.search.replace('?', ''))
  }

  setTeacher(data) {
    this.setState({
      signedInTeacher: !_l.isEmpty(data)
    })
  }

  analytics() {
    return new AnalyticsWrapper();
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

  fetchUnitTemplateModels() {
    requestGet('/teachers/unit_templates', (data) => {
      this.updateUnitTemplateModels(data.unit_templates)
    })
  }

  filterModels = (category, grade, typeId, gradeLevelRange) => {
    const { unitTemplatesManager, } = this.state
    let displayedModels = unitTemplatesManager.models
    if (grade) {
      displayedModels = this.modelsInGrade(grade)
    }
    if (category) {
      displayedModels = displayedModels.filter(ut => ut.unit_template_category.name === category)
    }
    if (typeId) {
      const selectedType = ACTIVITY_PACK_TYPES.find(t => t.id === typeId)
      const { name } = selectedType
      displayedModels = displayedModels.filter(ut => {
        const { type, unit_template_category } = ut
        if(typeId === 'independent-practice') {
          return selectedType.types.includes(unit_template_category.name)
        } else if(unit_template_category) {
          return unit_template_category.name === name
        } else if(type) {
          return type.name === name
        }
      })
    }
    if (gradeLevelRange) {
      displayedModels = displayedModels.filter(ut => ut.grade_level_range === gradeLevelRange)
    }
    return displayedModels
  };

  modelsInGrade(grade) {
    const { unitTemplatesManager, } = this.state
    return _.reject(unitTemplatesManager.models, (m) => {
      return _.indexOf(m.grades, grade)
    });
  }

  returnToIndex() {
    this.updateUnitTemplatesManager({ stage: 'index' })
    window.scrollTo(0, 0);
  }

  selectCategory = category => {
    const { history, } = this.props
    const { unitTemplatesManager, } = this.state
    const newUnitTemplatesManager = unitTemplatesManager
    newUnitTemplatesManager.selectedCategoryId = category.value
    this.setState({ unitTemplatesManager: newUnitTemplatesManager })

    history.push(category.link)
  };

  selectGradeLevel = gradeLevel => {
    const { history, } = this.props
    const { unitTemplatesManager, } = this.state
    const newUnitTemplatesManager = unitTemplatesManager
    newUnitTemplatesManager.selectedGradeLevel = gradeLevel.value
    this.setState({ unitTemplatesManager: newUnitTemplatesManager })

    history.push(gradeLevel.link)
  };

  showAllGrades() {
    this.updateUnitTemplatesManager({grade: null});
    window.scrollTo(0, 0);
  }

  showUnitTemplates() {
    const { unitTemplatesManager, signedInTeacher, } = this.state
    if (unitTemplatesManager.models.length < 1) {
      return <LoadingIndicator />
    }

    const { category, grade, type, gradeLevel, } = this.parsedQueryParams()
    const displayedModels = this.filterModels(category, grade, type, gradeLevel)
    return (
      <UnitTemplateMinis
        actions={this.unitTemplatesManagerActions()}
        data={unitTemplatesManager}
        displayedModels={displayedModels}
        selectCategory={this.selectCategory}
        selectedTypeId={type}
        selectGradeLevel={this.selectGradeLevel}
        signedInTeacher={signedInTeacher}
        types={ACTIVITY_PACK_TYPES}
      />
    )
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

  unitTemplatesManagerActions() {
    return {
      toggleTab: this.toggleTab,
      clickAssignButton: this.clickAssignButton,
      returnToIndex: this.returnToIndex,
      selectModel: this.selectModel,
      showAllGrades: this.showAllGrades
    };
  }

  updateUnitTemplateModels = models => {
    const { unitTemplatesManager, } = this.state
    const categories = _.chain(models).pluck('unit_template_category').uniq(_.property('id')).value();
    const newHash = {
      models,
      displayedModels: models,
      categories
    }
    const modelId = unitTemplatesManager.model_id // would be set if we arrived here from a deep link
    if (modelId) {
      newHash.model = _.findWhere(models, {id: model_id});
      newHash.stage = 'profile'
    }
    this.updateUnitTemplatesManager(newHash)

    const { category, grade, type, gradeLevel, } = this.parsedQueryParams()

    if (category || grade || type || gradeLevel) {
      this.filterModels(category, grade, type, gradeLevel)
    }
  };

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
