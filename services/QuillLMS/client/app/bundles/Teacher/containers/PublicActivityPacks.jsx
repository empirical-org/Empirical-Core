import React from 'react'
import $ from 'jquery';
import { requestGet } from '../../../modules/request';
import _ from 'underscore'
import _l from 'lodash'
import ManageUnits from '../components/assignment_flow/manage_units/manage_units'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import fnl from '../components/modules/fnl'
import updaterGenerator from '../components/modules/updater'
import Server from '../components/modules/server/server'
import WindowPosition from '../components/modules/windowPosition'
import AnalyticsWrapper from '../components/shared/analytics_wrapper'


export default class PublicActivityPacks extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition(),
    };

    this.deepExtendState = this.modules.updaterGenerator.updater(null)
    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateCreateUnitModel = this.modules.updaterGenerator.updater('createUnit.model');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    let state = {
      tab: 'manageUnits', // 'createUnit', 'exploreActivityPacks'
      createUnit: {
        stage: 1,
        options: {
          classrooms: []
        },
        model: {
          name: null,
          selectedActivities: []
        }
      },
      unitTemplatesManager: {
        models: [],
        categories: [],
        stage: 'index', // index, profile,
        model: null,
        model_id: null,
        relatedModels: [],
        displayedModels: [],
        selectedCategoryId: null
      }
    }
    state.unitTemplatesManager.non_authenticated = !($('#public-activity-packs').data('authenticated'));
    //FIXME: this concern should be handled with a react-router
    let individualUnitTemplate = $('.teachers-unit-template')[0]
    if (individualUnitTemplate) {
      state.tab = 'exploreActivityPacks';
      state.unitTemplatesManager.model_id = $('.teachers-unit-template').data('id');
    }
    this.state = state;
  }

  componentDidMount() {
    this.fetchUnitTemplateModels();
  }

  selectModel = (ut) => {
    let relatedModels = this._modelsInCategory(ut.unit_template_category.id)
    this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
    this.modules.windowPosition.reset();
  };

  _modelsInCategory = (categoryId) => {
    return this.state.unitTemplatesManager.models.filter(ut => {
      if (ut.unit_template_category && ut.unit_template_category.id === categoryId) {
        return ut
      }
    })
  };

  updateUnitTemplateModels = (models) => {
    let categories =  _.chain(models)
      .pluck('unit_template_category')
      .uniq(_.property('id'))
      .value();

    let newHash = {
      models: models,
      displayedModels: models,
      categories: categories
    }
    let model_id = this.state.unitTemplatesManager.model_id // would be set if we arrived here from a deep link
    if (model_id) {
      newHash.model = _.findWhere(models, {id: model_id});
      newHash.stage = 'profile'
    }
    this.updateUnitTemplatesManager(newHash)
  };

  returnToIndex = () => {
    this.updateUnitTemplatesManager({stage: 'index'})
    window.scrollTo(0, 0);
  };

  filterByCategory = (categoryId) => {
    if (categoryId) {
      var uts = this._modelsInCategory(categoryId)
    } else {
      var uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts, selectedCategoryId: categoryId});
  };

  fetchUnitTemplateModels = () => {
    this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);
  };

  fetchClassrooms = () => {
    let that = this;
    requestGet('/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
      (data) => {
        that.updateCreateUnit({options: {classrooms: data.classrooms_and_their_students}})
      }
    );
  };

  getSelectedActivities = () => {
    return this.state.createUnit.model.selectedActivities;
  };

  assign = () => {
    this.fetchClassrooms()
    let unitTemplate = this.state.unitTemplatesManager.model;
    let state = this.state;
    let hash = {
      tab: 'createUnit',
      createUnit: {
        stage: 2,
        model: {
          name: unitTemplate.name,
          selectedActivities: unitTemplate.activities
        }
      }
    }
    this.deepExtendState(hash);
  };

  signUp = () => {
    window.location.href = '/account/new';
  };

  unitTemplatesManagerActions = () => {
    return {
      assign: this.assign,
      returnToIndex: this.returnToIndex,
      filterByCategory: this.filterByCategory,
      selectModel: this.selectModel,
      signUp: this.signUp
    }
  };

  render() {
    let tabSpecificComponents;

    tabSpecificComponents = (<UnitTemplatesManager
      actions={this.unitTemplatesManagerActions()}
      data={this.state.unitTemplatesManager}
    />);

    return (
      <span>
        <div id="lesson_planner" >
          {tabSpecificComponents}
        </div>
      </span>
    );

  }
}
