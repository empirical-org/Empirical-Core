'use strict'

 import React from 'react'
 import LoadingIndicator from '../../../shared/loading_indicator'
 import UnitTemplateProfileHeader from './unit_template_profile_header'
 import UnitTemplateProfileDescription from './unit_template_profile_description'
 import UnitTemplateProfileAssignButton from './unit_template_profile_assign_button'
 import UnitTemplateProfileShareButtons from './unit_template_profile_share_buttons'
 import UnitTemplateProfileStandards from './unit_template_profile_standards'
 import UnitTemplateProfileActivityTable from './unit_template_profile_activity_table'
 import RelatedUnitTemplates from './related_unit_templates'

 export default class UnitTemplateProfile extends React.Component {

   state = {
     data: null,
     loading: true,
     relatedModels: [],
   }

  componentDidMount() {
    const that = this;
    $.ajax({
      type: 'get',
      datatype: 'json',
      data: {id: this.props.params.activityPackId},
      url: '/teachers/unit_templates/profile_info',
      statusCode: {
        200: function(response) {
          that.displayUnit(response)
        }
      }
    })
  }

  displayUnit(response) {
    this.setState({
      data: response.data,
      relatedModels: response.related_models,
      loading: false
    })
  }

  stateBasedComponent() {
    if (this.state.loading) {
      return <LoadingIndicator />
    } else {
      return (
        <div className='unit-template-profile'>
          <UnitTemplateProfileHeader data={this.state.data} />
          <div className="container white">

            <div className='row first-content-section'>
              <div className='col-xs-6 left-hand-side'>
                <UnitTemplateProfileDescription data={this.state.data} />
              </div>

              <div className='col-xs-6'>
                <div className='row'>
                  <div className='col-xs-12'>
                    <UnitTemplateProfileAssignButton data={this.state.data} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12">
                    <div className='row'>
                      <div className='col-xs-12'>
                        <UnitTemplateProfileStandards data={this.state.data} />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-xs-12'>
                        <UnitTemplateProfileShareButtons data={this.state.data} />
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
                <UnitTemplateProfileActivityTable data={this.state.data}/>
              </div>
            </div>

              <RelatedUnitTemplates models={this.state.relatedModels} data={this.props.params.activityPackId}/>
              <div className='row'>
                <a href="/teachers/classrooms/activity_planner#/tab/featured-activity-packs"><button className='see-all-activity-packs button-grey button-dark-grey text-center center-block'>See All Activity Packs</button></a>
              </div>
            </div>
          </div>
          )
    }
  }


  render() {
    return <span>{this.stateBasedComponent()}</span>
  }
}
