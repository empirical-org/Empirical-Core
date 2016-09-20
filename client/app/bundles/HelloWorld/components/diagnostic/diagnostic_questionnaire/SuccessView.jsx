import React from 'react'
import UnitTemplateAssigned from '../../lesson_planner/unit_template_assigned.jsx'


export default React.createClass({

  render: function() {
    return (
      <UnitTemplateAssigned data={{name: 'Diagnostic', id: 'diagnostic'}} type={'diagnostic'}/>
    );
   }
 });
