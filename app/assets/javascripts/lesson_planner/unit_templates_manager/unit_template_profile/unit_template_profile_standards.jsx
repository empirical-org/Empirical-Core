EC.UnitTemplateProfileStandards = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getStandards: function () {
    return _.map(this.props.data.model.activities, function (act) {
      return act.topic
    })
  },

  renderStandards: function (standards) {
    return _.map(standards, function(standard){
      return <dd>{standard.name}</dd>
    })
  },

  renderConcepts: function (standards) {
    return _.map(standards, function(standard){
      return <dd className='concept'>{standard.topic_category.name}</dd>
    })
  },

  render: function () {
    return (
      <div className='standards-and-concepts light-gray-bordered-box'>
        <dl>
          <dt><strong>Standards</strong></dt>
          { this.renderStandards(this.getStandards()) }

          <dt className='concepts'><strong>Concepts</strong></dt>
          { this.renderConcepts(this.getStandards()) }
        </dl>
      </div>
    )
  }
});