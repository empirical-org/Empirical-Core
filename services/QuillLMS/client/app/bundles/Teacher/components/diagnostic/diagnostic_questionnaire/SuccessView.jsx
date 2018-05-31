import React from 'react'
import UnitTemplateAssigned from '../../lesson_planner/diagnostic_assigned.jsx'


export default React.createClass({

  render: function() {
    let name, id
    if (this.props.params.activityId == 447) {
      name = 'ELL Diagnostic'
      id = 34
    } else if (this.props.params.activityId == 413) {
      name = 'Sentence Structure Diagnostic'
      id = 20
    }
    return (
      <UnitTemplateAssigned data={{name, id}} type={'diagnostic'}/>
    );
   }
 });
