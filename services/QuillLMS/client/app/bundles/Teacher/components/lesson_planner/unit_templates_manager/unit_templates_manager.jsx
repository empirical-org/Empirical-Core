import React from 'react'
import _l from 'lodash'
import _ from 'underscore'
import UnitTemplateMinis from './unit_template_minis/unit_template_minis'
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

    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

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
        displayedModels: [],
        selectedCategoryId: null,
        lastActivityAssigned: null,
        grade: getParameterByName('grade'),
      }
    }

    this.updateUnitTemplateModels = this.updateUnitTemplateModels.bind(this)
  }

  componentDidMount() {
  	this.fetchUnitTemplateModels();
    this.fetchTeacher();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.category !== nextProps.location.query.category) {
      this.filterByCategory(nextProps.location.query.category)
    } else if (this.props.location.query.grade && !nextProps.location.query.grade) {
      this.showAllGrades()
    } else if (this.props.location.query.type !== nextProps.location.query.type) {
      this.filterByType(nextProps.location.query.type)
    }
  }

  analytics() {
    return new AnalyticsWrapper();
  }

  unitTemplatesManagerActions() {
    return {
      toggleTab: this.toggleTab,
      clickAssignButton: this.clickAssignButton,
      returnToIndex: this.returnToIndex,
      filterByCategory: this.filterByCategory,
      filterByGrade: this.filterByGrade,
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

    const category = getParameterByName('category')
    const type = getParameterByName('type')
    if (category) {
      this.filterByCategory(category)
    } else if (type) {
      this.filterByType(type)
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

  filterByGrade() {
    const grade = this.state.unitTemplatesManager.grade
    let uts
    if (grade) {
      uts = this.modelsInGrade(grade)
    } else {
      uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts});
  }

  filterByCategory(categoryName) {
    let selectedCategoryId, unitTemplates
    if (categoryName) {
      categoryName = categoryName.toUpperCase() === 'ELL' ? categoryName.toUpperCase() : _l.capitalize(categoryName)
      selectedCategoryId = this.state.unitTemplatesManager.categories.find((cat) => cat.name === categoryName).id
      unitTemplates = _l.filter(this.state.unitTemplatesManager.models, {
        unit_template_category: {
          name: categoryName
        }
      })
    } else {
      unitTemplates = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: unitTemplates, selectedCategoryId: selectedCategoryId});
  }

  filterByType(typeId) {
    const { models, } = this.state.unitTemplatesManager
    let unitTemplates = models
    if (typeId) {
      const selectedTypeName = types.find((type) => type.id === typeId).name
      unitTemplates = models.filter(ut => ut.type.name === selectedTypeName)
    }
    this.updateUnitTemplatesManager({ stage: 'index', displayedModels: unitTemplates, });
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

  showUnitTemplates() {
    if (this.state.unitTemplatesManager.models.length < 1) {
      return <LoadingIndicator />
    }
    return (<UnitTemplateMinis
      signedInTeacher={this.state.signedInTeacher}
      data={this.state.unitTemplatesManager}
      actions={this.unitTemplatesManagerActions()}
      types={types}
      selectedTypeId={this.props.location.query.type}
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
