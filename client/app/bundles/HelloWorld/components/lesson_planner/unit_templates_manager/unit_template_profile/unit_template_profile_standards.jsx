import React from 'react';
import _ from 'underscore';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getStandards() {
    return _.chain(this.props.data.activities)
            .map(_.property('topic'))
            .uniq(_.property('name'))
            .value();
  },

  getConcepts() {
    return _.uniq(_.map(this.getStandards(), standard => standard.topic_category.name));
  },

  renderStandards(standards) {
    return _.map(standards, standard => <dd key={standard.name}>{standard.name}</dd>);
  },

  renderConcepts(concepts) {
    return _.map(concepts, concept => <dd key={concept} className="concept">{concept}</dd>);
  },

  render() {
    return (
      <div className="standards-and-concepts light-gray-bordered-box">
        <dl>
          <dt><strong>Standards</strong></dt>
          {this.renderStandards(this.getStandards())}

          <dt className="concepts"><strong>Concepts</strong></dt>
          {this.renderConcepts(this.getConcepts())}
        </dl>
      </div>
    );
  },
});
