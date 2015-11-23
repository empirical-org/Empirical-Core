EC.UnitTemplateProfileStandards = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className='standards-and-concepts light-gray-bordered-box'>
        <dl>
          <dt><strong>Standards</strong></dt>
          <dd>3.1g Form and use Comparative and Superlative Adjectives.</dd>
          <dd>3.2b Use Commas in Addresses</dd>
          <dd>3.2c Form and use Possessives</dd>

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