EC.UnitTemplateProfile = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
      <div className='unit-template-profile'>

        <EC.UnitTemplateProfileHeader data={this.props.data}
                                   actions={this.props.actions} />

        <div className="container white">

          <div className='row first-content-section'>
            <div className='col-xs-6 left-hand-side'>
              <EC.UnitTemplateProfileDescription data={this.props.data} />
            </div>

            <div className='col-xs-6'>
              <div className='row'>
                <div className='col-xs-12'>
                  <EC.UnitTemplateProfileAssignButton data={this.props.data}
                                   actions={this.props.actions} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className='row'>
                    <div className='col-xs-12'>
                      <EC.UnitTemplateProfileStandards data={this.props.data} />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <EC.UnitTemplateProfileShareButtons data={this.props.data} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-xs-12 no-pl'>
              <h2>{"What's Inside The Pack"}</h2>
            </div>
          </div>
          <div className='row'>
            <div classsName='col-xs-12'>
              <EC.UnitTemplateProfileActivityTable data={this.props.data}
                                   actions={this.props.actions} />
            </div>
          </div>


          <EC.RelatedUnitTemplates models={this.props.data.relatedModels}
                                   actions={this.props.actions} />
          <div className='row'>
            <button onClick={this.props.actions.returnToIndex} className='see-all-activity-packs button-grey button-dark-grey text-center center-block'>See All Activity Packs</button>
          </div>
        </div>
      </div>
    );
  }
});