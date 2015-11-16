EC.UnitTemplate = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  assign: function () {
    this.props.eventHandlers.assign(this.props.data.model);
  },

  render: function () {
    return (
      <div>
        <div className='row big-title middle-school'>
          <div className='col-xs-12'>
            <a className='unit-template-category-label img-rounded'>UNIVERSITY</a>
            <h1>{this.props.data.model.name}</h1>
            <div className="author-details">
              <img src={this.props.data.model.author.avatar_url}></img>
              <p>by Silvia Furth</p>
            </div>
          </div>
        </div>

        <div>
          <div className='row'>
            <div className='col-xs-6'>
              <div className='row'>
                <div className='col-xs-12'>
                  <strong>Problem</strong>
                  <p>Students often forget to add commas in addresses and to add apostrophes in contractions
                  </p>
                </div>
              </div>

              <div className='row'>
                <div className='col-xs-12'>
                  <strong>Summary</strong>
                  <p>Students often forget to add commas in addresses and to add apostrophes in contractions
                  </p>
                </div>
              </div>

              <div className='row'>
                <div className='col-xs-12'>
                  <strong>About the Author</strong>
                  <p>Students often forget to add commas in addresses and to add apostrophes in contractions
                  </p>
                </div>
              </div>

              <div className='row'>
                <div className='col-xs-12'>
                  <strong>Teacher Review</strong>
                  <p>Students often forget to add commas in addresses and to add apostrophes in contractions
                  </p>
                </div>
              </div>

            </div>

            <div className='col-xs-6'>
              <div className='row'>
                <div className='col-xs-12'>
                  <button className='button-green' onClick={this.assign}>assign</button>
                  <p>Estimated Time: 45 mins</p>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <p><strong>Standards</strong></p>
                  <ul>
                    <li>3.1g Form and use Comparative and Superlative Adjectives.</li>
                    <li>3.2b Use Commas in Addresses</li>
                    <li>3.2c Form and use Possessives</li>
                  </ul>
                  <p><strong>Concepts</strong></p>
                  <ul>
                    <li>Commas in Numbers</li>
                    <li>Capitalization</li>
                    <li>Determiners</li>
                    <li>Prepositions</li>
                    <li>Commas & Proper Nouns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EC.RelatedUnitTemplates models={this.props.data.relatedModels}
                                 eventHandlers={this.props.eventHandlers} />
        <div className='row'>
          <div className='center-block'>
            <button onClick={this.props.eventHandlers.returnToIndex} className='button-grey button-dark-grey'>See All Activity Packs</button>
          </div>
        </div>
      </div>
    );
  }
});