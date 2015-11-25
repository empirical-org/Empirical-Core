EC.UnitTemplateProfileStandards = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getStandards: function () {
    return _.map(this.props.data.model.activities, function (act) {
      return act.topic.name
    })
  },

  // renderStandards: function (standards) {
  //   return (
  //     { _.map(standards, function(standard){
  //       return <dd>{standard}</dd>
  //     }) }
  //   )
  // },

  render: function () {
    return (
      <div className='standards-and-concepts light-gray-bordered-box'>
        <dl>
          <dt><strong>Standards</strong></dt>
          { this.getStandards().map(function(standard){
            return <dd>{standard}</dd>
          }) }

          <dt className='concepts'><strong>Concepts</strong></dt>
          <dd className='concept'>Commas in Numbers</dd>
          <dd className='concept'>Capitalization</dd>
          <dd className='concept'>Determiners</dd>
          <dd className='concept'>Prepositions</dd>
          <dd className='concept'>Commas & Proper Nouns</dd>
        </dl>
      </div>
    )
  }
});