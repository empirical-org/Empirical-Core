import React from 'react'
import { requestGet, requestPost } from '../../../modules/request';
import _ from 'underscore'
import _l from 'lodash'
import UnitTemplatesAssigned from '../components/assignment_flow/unit_template_assigned'
import CreateUnit from '../components/assignment_flow/create_unit/create_unit'
import ManageUnits from '../components/assignment_flow/manage_units/manage_units'
import UnitTemplatesManager from '../components/assignment_flow/unit_templates_manager/unit_templates_manager'
import fnl from '../components/modules/fnl'
import updaterGenerator from '../components/modules/updater'
import Server from '../components/modules/server/server'
import WindowPosition from '../components/modules/windowPosition'
import AnalyticsWrapper from '../components/shared/analytics_wrapper'
import AssignANewActivity from '../components/assignment_flow/create_unit/assign_a_new_activity.jsx'
import AssignADiagnostic from '../components/assignment_flow/create_unit/assign_a_diagnostic.tsx'

export default class LessonPlanner extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.modules = {
      fnl: new fnl,
      updaterGenerator: new updaterGenerator(this),
      unitTemplatesServer: new Server('unit_template', 'unit_templates', '/teachers'),
      windowPosition: new WindowPosition()
    };

    this.deepExtendState = this.modules.updaterGenerator.updater(null)
    this.updateCreateUnit = this.modules.updaterGenerator.updater('createUnit');
    this.updateCreateUnitModel = this.modules.updaterGenerator.updater('createUnit.model');
    this.updateUnitTemplatesManager = this.modules.updaterGenerator.updater('unitTemplatesManager');

    const state = this.blankState();

    const { grade, } = this.props;
    if (grade) {
      state.unitTemplatesManager.grade = grade;
    }

    const tab = ($('#activity-planner').data('tab'));
    if (tab) {
      state.tab = tab;
    }
    //FIXME: this concern should be handled with a react-router
    const individualUnitTemplate = $('.teachers-unit-template')[0]
    if (individualUnitTemplate) {
      state.tab = 'exploreActivityPacks';
      state.unitTemplatesManager.model_id = $('.teachers-unit-template').data('id');
    }

    this.state = state;
  }

  componentDidMount() {
    if (this.state.tab === 'exploreActivityPacks') {
      this.fetchUnitTemplateModels();
    }
  }

  analytics = () => new AnalyticsWrapper();

  blankState = () => {
    return {
      tab: 'manageUnits', // 'createUnit', 'exploreActivityPacks'
      createUnit: {
        stage: 1,
        options: {
          classrooms: []
        },
        model: {
          id: null,
          name: null,
          selectedActivities: [],
          dueDates: {}
        }
      },
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
        grade: null
      }
    }
  };

  editUnit = (unitId) => requestGet(`/teachers/units/${unitId}/edit`, this.editUnitRequestSuccess);

  editUnitRequestSuccess = (data) => {
    this.updateCreateUnitModel({id: data.id, name: data.name, dueDates: data.dueDates, selectedActivities: data.selectedActivities})
    this.updateCreateUnit({
      options: {
        classrooms: data.classrooms
      }
    })
    this.setState({tab: 'createUnit'})
  };

  assignActivityDueDate = (activity, dueDate) => {
    const dueDates = this.state.createUnit.model.dueDates || {}
    dueDates[activity.id] = dueDate;
    this.updateCreateUnitModel({dueDates: dueDates})
  };

  selectModel = (ut) => {
    const relatedModels = _l.filter(this.state.unitTemplatesManager.models, {
      unit_template_category: {
        id: ut.unit_template_category.id
      }
    })
    this.updateUnitTemplatesManager({stage: 'profile', model: ut, relatedModels: relatedModels})
    this.modules.windowPosition.reset();
  };

  _modelsInGrade = (grade) => {
    return _.reject(this.state.unitTemplatesManager.models, function(m) {
      return _.indexOf(m.grades, grade)
    });
  };

  updateUnitTemplateModels = (models) => {
    const categories = _.chain(models).pluck('unit_template_category').uniq(_.property('id')).value();
    const newHash = {
      models,
      displayedModels: models,
      categories
    }
    const model_id = this.state.unitTemplatesManager.model_id // would be set if we arrived here from a deep link
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

  showAllGrades = () => {
    this.updateUnitTemplatesManager({grade: null});
    window.scrollTo(0, 0);
  };

  filterByGrade = () => {
    const { grade, models, } = this.state.unitTemplatesManager;
    let uts;
    if (grade) {
      uts = this._modelsInGrade(grade)
    } else {
      uts = models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts});
  };

  filterByCategory = (categoryId) => {
    let uts
    if (categoryId) {
      uts = _l.filter(this.state.unitTemplatesManager.models, {
        unit_template_category: {
          id: categoryId
        }
      })
    } else {
      uts = this.state.unitTemplatesManager.models;
    }
    this.updateUnitTemplatesManager({stage: 'index', displayedModels: uts, selectedCategoryId: categoryId});
  };

  fetchUnitTemplateModels = () => this.modules.unitTemplatesServer.getModels(this.updateUnitTemplateModels);

  toggleTab = (tab) => {
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
    } else if (tab === 'exploreActivityPacks') {
      this.deepExtendState({
        tab: tab,
        unitTemplatesManager: {
          stage: 'index',
          firstAssignButtonClicked: false,
          model_id: null,
          model: null
        }
      });
      this.fetchUnitTemplateModels();
    } else {
      this.setState({tab: tab});
    }
  };

  toggleStage = (stage) => {
    this.updateCreateUnit({stage: stage})
    if (!this.state.createUnit.options.classrooms.length) {
      this.fetchClassrooms();
    }
  };

  fetchClassrooms = () => {
    requestGet('/teachers/classrooms/retrieve_classrooms_for_assigning_activities', (data) => {
      that.updateCreateUnit({
        options: {
          classrooms: data.classrooms_and_their_students
        }
      })
    });
  };

  getInviteStudentsUrl = () =>  ('/teachers/classrooms/invite_students');

  getSelectedActivities = () => this.state.createUnit.model.selectedActivities;

  toggleActivitySelection = (activity, true_or_false) => {
    if (true_or_false) {
      this.analytics().track('select activity in lesson planner', {
        name: activity.name,
        id: activity.id
      });
    }
    let sas = this.modules.fnl.toggleById(this.getSelectedActivities(), activity);
    this.updateCreateUnitModel({selectedActivities: sas});
  };

  clickAssignButton = () => this.updateUnitTemplatesManager({firstAssignButtonClicked: true});

  onFastAssignSuccess = () => {
    let lastActivity = this.state.unitTemplatesManager.model;
    this.analytics().track('click Create Unit', {});
    this.deepExtendState(this.blankState());
    this.updateUnitTemplatesManager({lastActivityAssigned: lastActivity});
    this.fetchClassrooms();
    this.updateUnitTemplatesManager({assignSuccess: true});
  };

  fastAssign = () => {
    requestPost('/teachers/unit_templates/fast_assign',
      {id: this.state.unitTemplatesManager.model.id},
      this.onFastAssignSuccess,
      (response) => {
        window.alert(response.error_message);
      }
    );
  };

  unitTemplatesAssignedActions = () => {
    return {studentsPresent: this.props.students, getInviteStudentsUrl: this.getInviteStudentsUrl, getLastClassroomName: this.props.classroomName, unitTemplatesManagerActions: this.unitTemplatesManagerActions};
  };

  unitTemplatesManagerActions = () => {
    return {
      toggleTab: this.toggleTab,
      customAssign: this.fastAssign,
      fastAssign: this.fastAssign,
      clickAssignButton: this.clickAssignButton,
      returnToIndex: this.returnToIndex,
      filterByCategory: this.filterByCategory,
      filterByGrade: this.filterByGrade,
      selectModel: this.selectModel,
      showAllGrades: this.showAllGrades
    };
  };

  manageUnit = () => {
    <ManageUnits actions={{
      toggleTab: this.toggleTab,
      editUnit: this.editUnit
    }}
    />;
  };

  render() {
    let tabSpecificComponents;
    // Ultimately, none of the tab state should exist, and we should transfer
    // entirely to react-router for managing that, along with redux for
    // the general state in this section
    const tabParam = this.props.match.params.tab
    // if (this.state.unitTemplatesManager.assignSuccess === true && (!tabParam || tabParam === ('featured-activity-packs' || 'explore-activity-packs'))) {
    // 	tabSpecificComponents = <UnitTemplatesAssigned data={this.state.unitTemplatesManager.lastActivityAssigned} actions={this.unitTemplatesAssignedActions()}/>;
    // } else
    if ((tabParam === 'activity-library' || (this.state.tab === 'createUnit' && !tabParam))) {
      tabSpecificComponents = (<CreateUnit
        actions={{
          toggleStage: this.toggleStage,
          toggleTab: this.toggleTab,
          assignActivityDueDate: this.assignActivityDueDate,
          update: this.updateCreateUnitModel,
          toggleActivitySelection: this.toggleActivitySelection,
          assignSuccessActions: this.unitTemplatesAssignedActions()
        }}
        analytics={this.analytics()}
        data={{
          createUnitData: this.state.createUnit,
          assignSuccessData: this.state.unitTemplatesManager.model
        }}
      />)
    } else if ((tabParam === 'assign-new-activity') || (this.state.tab === 'assignANewActivity' && !tabParam)) {
      tabSpecificComponents = <AssignANewActivity flag={this.props.flag} toggleTab={this.toggleTab} />;
    } else if ((tabParam === 'diagnostic') || (this.state.tab === 'assignADiagnostic' && !tabParam)) {
      tabSpecificComponents = <AssignADiagnostic />;
    } else if ((tabParam === 'manage-units') || (this.state.tab === 'manageUnits' && !tabParam)) {
      tabSpecificComponents = (<ManageUnits
        actions={{
          toggleTab: this.toggleTab,
          editUnit: this.editUnit
        }}
      />)
    // 	} else if (tabParam === 'explore-activity-packs' || this.state.tab === 'exploreActivityPacks') {
    // 		tabSpecificComponents = <UnitTemplatesManager data={this.state.unitTemplatesManager} actions={this.unitTemplatesManagerActions()}/>;
    }

    return (
      <span>
        <div id="lesson_planner">
          {tabSpecificComponents}
        </div>
      </span>
    );

  }
}
