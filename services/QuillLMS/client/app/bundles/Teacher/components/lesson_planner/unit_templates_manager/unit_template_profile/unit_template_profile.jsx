

import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import _ from 'underscore';

import LoadingIndicator from '../../../shared/loading_indicator';
import ScrollToTop from '../../../shared/scroll_to_top';
import UnitTemplateProfileHeader from './unit_template_profile_header';
import UnitTemplateProfileDescription from './unit_template_profile_description';
import UnitTemplateProfileAssignButton from './unit_template_profile_assign_button';
import UnitTemplateProfileShareButtons from './unit_template_profile_share_buttons';
import UnitTemplateProfileStandards from './unit_template_profile_standards';
import UnitTemplateProfileActivityTable from './unit_template_profile_activity_table';
import RelatedUnitTemplates from './related_unit_templates';

export default class UnitTemplateProfile extends React.Component {

  state = {
    data: null,
    loading: true,
    relatedModels: [],
  }

  componentDidMount() {
    this.getProfileInfo(this.props.params.activityPackId);
  }

  getProfileInfo(id) {
    const that = this;
    $.ajax({
      type: 'get',
      datatype: 'json',
      data: {
        id,
      },
      url: '/teachers/unit_templates/profile_info',
      statusCode: {
        200(response) {
          that.displayUnit(response);
        },
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.location, nextProps.location)) {
      this.setState({ loading: true, });
      this.getProfileInfo(nextProps.params.activityPackId);
    }
  }

  displayUnit(response) {
    this.setState({
      data: response.data,
      relatedModels: response.related_models,
      referralCode: response.referral_code,
      loading: false
    })
  }

  indexLink() {
    return this.state.data.non_authenticated
      ? '/activities/packs'
      : '/teachers/classrooms/assign_activities/featured-activity-packs';
  }

  socialShareUrl() {
    return `${window.location}${this.state.referralCode ? '?champion=' + this.state.referralCode : ''}`
  }

  socialText() {
    return `Check out the '${this.state.data.name}' activity pack I just assigned on Quill.org! ${this.socialShareUrl()}`
  }

  getMetaText(data) {
    return `Check out the '${data.name}' activity pack I just assigned on Quill.org!`;
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator  />;
    }
    if (document.querySelector("meta[name='og:description']")) {
        document.querySelector("meta[name='og:description']").content = this.getMetaText(this.state.data);
      }
    return (
        <div className="unit-template-profile">
          <ScrollToTop  />
          <UnitTemplateProfileHeader data={this.state.data}  />
          <div className="unit-template-profile-container">
            <div className=" no-pl">
              <h2>{"What's Inside The Pack"}</h2>
            </div>
            <UnitTemplateProfileActivityTable data={this.state.data}  />
            <div className="first-content-section flex-row space-between first-content-section">
              <div className="description">
                <UnitTemplateProfileDescription data={this.state.data}  />
              </div>
              <div className="assign-buttons-and-standards">
                <UnitTemplateProfileAssignButton data={this.state.data}  />
                <UnitTemplateProfileStandards data={this.state.data}  />
                <UnitTemplateProfileShareButtons data={this.state.data} url={this.socialShareUrl()} text={this.socialText()}/>
              </div>
            </div>
            <div className="related-activity-packs">
              <RelatedUnitTemplates models={this.state.relatedModels} data={this.props.params.activityPackId} authenticated={!this.state.data.non_authenticated}  />
              <Link to={this.indexLink()}>
                <button className="see-all-activity-packs button-grey button-dark-grey text-center center-block">See All Activity Packs</button>
              </Link>
            </div>
          </div>
        </div>
      );
  }
}
