import React from 'react'
import UnitTemplateAssigned from '../../lesson_planner/unit_template_assigned.jsx'


React.createClass({

  render: function() {
    return (
      <UnitTemplateAssigned data={{activityName: 'Diagnostic', id: 'diagnostic'}}/>
    );
   }
 });
