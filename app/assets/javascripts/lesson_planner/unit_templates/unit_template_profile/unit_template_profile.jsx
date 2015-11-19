EC.UnitTemplateProfile = React.createClass({
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
      <div className='unit-template-profile'>
        <div className='big-title middle-school'>

            <p>
              <a className='unit-template-category-label img-rounded'>UNIVERSITY</a>
            </p>
            <h1><strong>Practicing Commonly Confused Words Lorem Ested</strong></h1>
            <div className="author-details">
              <div className="author-picture">
                <img src="http://www.fillmurray.com/300/300"></img>
              </div>
              <p>by Bill Murray</p>
            </div>

        </div>

        <div className="container white">

          <div className='row first-content-section'>
            <div className='col-xs-6 left-hand-side'>
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
                  <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: &nbsp;45 mins</p>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className='row'>
                    <div className='col-xs-12'>
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
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <div className='share light-gray-bordered-box'>
                        <strong>Share this Activity Pack</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div classsName='col-xs-12'>
              <table className='table activity-table'>
                <thead>
                  <th>App</th>
                  <th>Activity</th>
                  <th>Concept</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className='icon-puzzle-gray'></div>
                    </td>
                    <td>
                      The Last Flight of the Apollo : The Apollo-Soyuz Test Mission (History)
                    </td>
                    <td>
                      Summative Assessments
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='icon-flag-gray'></div>
                    </td>
                    <td>
                      The Day the Island Breathed (Fiction)
                    </td>
                    <td>
                      Prepositions
                    </td>
                  </tr>
                </tbody>
              </table>
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
      </div>
    );
  }
});