import React from 'react';
import _ from 'underscore';

const UnitTemplateProfileStandards = ({ data, }) => {
  const standards = _.uniq(data.activities.map(act => act.standard && act.standard.name)).filter(Boolean)
  const concepts = _.uniq(data.activities.map(act => act.standard && act.standard.standard_category && act.standard.standard_category.name)).filter(Boolean)
  const productionActivitiesRecommendedBy = data.diagnostics_recommended_by.filter(act => act.flags.includes("production") && act.name.length)

  if (!standards.length && !concepts.length && !data.readability && !productionActivitiesRecommendedBy.length) { return <span />}

  const renderStandards = () => {
    if (!standards.length) { return <span /> }

    return (
      <React.Fragment>
        <dt><strong>Standards</strong></dt>
        {standards.map(s => <dd key={s}>{s}</dd>)}
      </React.Fragment>
    )
  };

  const renderConcepts = () => {
    if (!concepts.length) { return <span /> }

    return (
      <React.Fragment>
        <dt><strong>Concepts</strong></dt>
        {concepts.map(s => <dd className="concept" key={s}>{s}</dd>)}
      </React.Fragment>
    )
  };

  const renderReadability = () => {
    if (!data.readability) { return <span /> }

    return (
      <React.Fragment>
        <dt><strong>Readability</strong></dt>
        <dd>{data.readability}</dd>
      </React.Fragment>
    )
  };

  const renderRecommendedBy = () => {
    if (productionActivitiesRecommendedBy.length === 0) { return <span /> }

    return (
      <React.Fragment>
        <dt><strong>Recommended by</strong></dt>
        {productionActivitiesRecommendedBy.map(s => <dd key={s}>{s.name}</dd>)}
      </React.Fragment>
    )
  };


  return (
    <div className="standards-and-concepts light-gray-bordered-box">
      <dl>
        {renderStandards()}
        {renderConcepts()}
        {renderReadability()}
        {renderRecommendedBy()}
      </dl>
    </div>
  );
}

export default UnitTemplateProfileStandards
