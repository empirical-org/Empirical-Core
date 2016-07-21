'use strict'

 import React from 'react'
 import UnitTemplateProfileHeader from './unit_template_profile_header'
 import UnitTemplateProfileDescription from './unit_template_profile_description'
 import UnitTemplateProfileAssignButton from './unit_template_profile_assign_button'
 import UnitTemplateProfileShareButtons from './unit_template_profile_share_buttons'
 import UnitTemplateProfileStandards from './unit_template_profile_standards'
 import UnitTemplateProfileActivityTable from './unit_template_profile_activity_table'
 import RelatedUnitTemplates from './related_unit_templates'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },


  render: function () {
    return (
      <div className='unit-template-profile'>
        <UnitTemplateProfileHeader data={this.props.data}
                                   actions={this.props.actions} />

        <div className="container white">

          <div className='row first-content-section'>
            <div className='col-xs-6 left-hand-side'>
              <UnitTemplateProfileDescription data={this.props.data} />
            </div>

            <div className='col-xs-6'>
              <div className='row'>
                <div className='col-xs-12'>
                  <UnitTemplateProfileAssignButton data={this.props.data}
                                   actions={this.props.actions} />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className='row'>
                    <div className='col-xs-12'>
                      <UnitTemplateProfileStandards data={this.props.data} />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <UnitTemplateProfileShareButtons data={this.props.data.model} />
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
            <div className='col-xs-12'>
              <UnitTemplateProfileActivityTable data={this.props.data}
                                   actions={this.props.actions} />
            </div>
          </div>


          <RelatedUnitTemplates models={this.props.data.relatedModels}
                                   actions={this.props.actions}
                                   data={this.props.data.model.id}/>
          <div className='row'>
            <button onClick={this.props.actions.returnToIndex} className='see-all-activity-packs button-grey button-dark-grey text-center center-block'>See All Activity Packs</button>
          </div>
        </div>
      </div>
    );
  }
});
