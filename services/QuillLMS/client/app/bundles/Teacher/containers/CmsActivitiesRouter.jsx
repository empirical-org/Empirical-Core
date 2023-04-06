import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ActivityClassifications from './ActivityClassifications';
import UnitTemplateCategories from './UnitTemplateCategories';
import UnitTemplates from './UnitTemplates';

import ActivityClassification from '../components/activity_classifications/activity_classification';
import UnitTemplate from '../components/unitTemplate';
import UnitTemplateCategory from '../components/unit_template_categories/unit_template_category';

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
