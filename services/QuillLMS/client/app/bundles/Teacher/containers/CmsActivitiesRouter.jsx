import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import UnitTemplates from './UnitTemplates';
import ActivityClassifications from './ActivityClassifications';
import UnitTemplateCategories from './UnitTemplateCategories';

import UnitTemplateCategory from '../components/unit_template_categories/unit_template_category';
import UnitTemplate from '../components/unit_templates/unit_template'
import ActivityClassification from '../components/activity_classifications/activity_classification'

function CmsActivitiesRouter(props) {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={routerProps => <UnitTemplate {...props} {...routerProps} />} path="/cms/unit_templates/:id/edit" />
        <Route component={routerProps => <UnitTemplate {...props} {...routerProps} />} path="/cms/unit_templates/new" />
        <Route component={routerProps => <ActivityClassification {...props} {...routerProps} />} path="/cms/activity_classifications/:id/edit" />
        <Route component={routerProps => <UnitTemplateCategory {...props} {...routerProps} />} path="/cms/unit_template_categories/:id/edit" />
        <Route component={UnitTemplates} path="/cms/unit_templates" />
        <Route component={ActivityClassifications} path="/cms/activity_classifications" />
        <Route component={UnitTemplateCategories} path="/cms/unit_template_categories" />
      </Switch>
    </BrowserRouter>
  );
};

export default CmsActivitiesRouter;
