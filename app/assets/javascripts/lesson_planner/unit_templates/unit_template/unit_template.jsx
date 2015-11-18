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
        <div className='big-title middle-school'>

            <p>
              <a className='unit-template-category-label img-rounded'>UNIVERSITY</a>
            </p>
            <h1><strong>{this.props.data.model.name}</strong></h1>
            <div className="author-details">
              <div className="author-picture">
                <img src="http://www.fillmurray.com/300/300"></img>
              </div>
              <p>by Bill Murray</p>
            </div>

        </div>

        <div className='row'>
          <div className='col-xs-6'>
            <dl>
              <dt><strong>Problem</strong></dt>
              <dd>Students often forget to add commas in addresses and to add apostrophes in contractions</dd>

              <dt><strong>Summary</strong></dt>
              <dd>Students often forget to add commas in addresses and to add apostrophes in contractions</dd>

              <dt><strong>About the Author</strong></dt>
              <dd>Students often forget to add commas in addresses and to add apostrophes in contractions</dd>

              <dt><strong>Teacher Review</strong></dt>
              <dd>Students often forget to add commas in addresses and to add apostrophes in contractions</dd>
            </dl>

          </div>

          <div className='col-xs-6'>
            <div className='row'>
              <div className='col-xs-12'>
                <button className='button-green full-width' onClick={this.assign}>Assign to Your Class</button>
                <p className="est-time"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> Estimated Time: 45 mins</p>
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