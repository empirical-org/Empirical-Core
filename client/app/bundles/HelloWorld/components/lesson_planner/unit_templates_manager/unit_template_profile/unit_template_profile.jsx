'use strict'

 import React from 'react'
 import { Link } from 'react-router'
 import LoadingIndicator from '../../../shared/loading_indicator'
 import ListFilterOptions from '../../../shared/list_filter_options/list_filter_options'
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
    this.getProfileInfo()
  }

  getProfileInfo() {
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

  componentWillReceiveProps(nextProps) {
    if (this.props.params.activityPackId !== nextProps.params.activityPackId) {
      location.reload()
    }
  }


  displayUnit(response) {
    this.setState({
      data: response.data,
      relatedModels: response.related_models,
      loading: false
    })
  }

  indexLink() {
    return this.state.data.non_authenticated
    ? '/activities/packs'
    : '/teachers/classrooms/activity_planner/featured-activity-packs'
  }

  showListFilterOptions() {
    return this.state.data.non_authenticated
    ?            <ListFilterOptions
                        userLoggedIn={!this.state.data.non_authenticated}
                        options={[
                                  {id: 6, name: 'High'},
                                  {id: 4, name: 'Elementary'},
                                  {id: 5, name: 'Middle'},
                                  {id: 3, name: 'ELL'},
                                  {id: 9, name: 'Diagnostic'}
                                ]}
                  />
    : null
  }

  stateBasedComponent() {
    if (this.state.loading) {
      return <LoadingIndicator />
    } else {
      return (
        <div className='unit-template-profile'>
          {this.showListFilterOptions()}
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

              <RelatedUnitTemplates models={this.state.relatedModels} data={this.props.params.activityPackId} authenticated={!this.state.data.non_authenticated}/>
              <div className='row'>
                <Link to={this.indexLink()}><button className='see-all-activity-packs button-grey button-dark-grey text-center center-block'>See All Activity Packs</button></Link>
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
