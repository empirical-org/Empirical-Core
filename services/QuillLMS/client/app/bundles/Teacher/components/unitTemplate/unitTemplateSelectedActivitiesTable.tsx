import * as React from 'react';

import { SortableList } from '../../../Shared/index';
import { unitTemplateDataTableFields, unitTemplateActivityRows } from '../../helpers/unitTemplates';

const UnitTemplateSelectedActivitiesTable = ({ activities, selectedActivities, handleRemoveActivity, updateOrder }) => {

  function activityRows() {
    const fullSelectedActivities = activities.length ? selectedActivities.map((act) => activities.find(a => act.id === a.id)) : [];
    const rows = unitTemplateActivityRows({ activities: fullSelectedActivities, handleClick: handleRemoveActivity, type: 'remove' });
    return rows.map((row) => {
      const { id, addActivity, name, description, inPacks, flag, readability, concept, tool, edit } = row;
      const fields = [addActivity, name, description, inPacks, flag, readability, concept, tool, edit];

      return(
        <tr className="data-table-row" key={id}>
          {fields.map((field, i) => {
            const style = { width: `${unitTemplateDataTableFields[i].width}`, minWidth: `${unitTemplateDataTableFields[i].width}` }
            return <td className={`data-table-row-section ${unitTemplateDataTableFields[i].rowSectionClassName}`} style={style}>{field}</td>
          })}
        </tr>
      )
    })
  }

  function renderHeaders() {
    return(
      <tr className="data-table-headers">
        {unitTemplateDataTableFields.map(header => {
          const { width, name } = header;
          const style = { width: `${width}`, minWidth: `${width}` }
          return <th className="data-table-header" scope="col" style={style}>{name}</th>;
        })}
      </tr>
    )
  }

  return (
    <div className="unit-template-activities-table unit-template-selected-activities-table">
      <h4 className="selected-activities-header">Selected Activities:</h4>
      <table className="data-table-body unit-template-activities-table-rows">
        {renderHeaders()}
        <tbody className="unit-template-activities-tbody">
          <SortableList data={activityRows()} sortCallback={updateOrder} />
        </tbody>
      </table>
    </div>
  )
}

export default UnitTemplateSelectedActivitiesTable
