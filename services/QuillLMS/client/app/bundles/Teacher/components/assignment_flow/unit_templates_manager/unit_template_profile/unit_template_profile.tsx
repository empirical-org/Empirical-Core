import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'underscore';

import UnitTemplateAuthenticationButtons from './unit_template_authentication_buttons';
import UnitTemplateProfileActivityTable from './unit_template_profile_activity_table';
import UnitTemplateProfileDisclaimer from './unit_template_profile_assign_button';
import UnitTemplateProfileDescription from './unit_template_profile_description';
import UnitTemplateProfileShareButtons from './unit_template_profile_share_buttons';
import UnitTemplateProfileStandards from './unit_template_profile_standards';

import { Activity } from '../../../../../../interfaces/activity';
import { UnitTemplateProfileInterface } from '../../../../../../interfaces/unitTemplate';
import { requestGet } from '../../../../../../modules/request/index';
import { redirectToActivity } from '../../../../../Shared';
import LoadingIndicator from '../../../shared/loading_indicator';
import ScrollToTop from '../../../shared/scroll_to_top';
import {
  ACTIVITY_IDS_ARRAY, CLICKED_ACTIVITY_PACK_ID, COLLEGE_BOARD_SLUG, UNIT_NAME, UNIT_TEMPLATE_ID, UNIT_TEMPLATE_NAME
} from '../../assignmentFlowConstants';
import AssignmentFlowNavigation from '../../assignment_flow_navigation';
import parsedQueryParams from '../../parsedQueryParams';

interface UnitTemplateProfileState {
  data: UnitTemplateProfile,
  loading: boolean,
  referralCode: string
}

export class UnitTemplateProfile extends React.Component<RouteComponentProps, UnitTemplateProfileState> {
  state = {
    data: null,
    loading: true,
    referralCode: ''
  }

  componentDidMount() {
    const { match } = this.props;
    const { activityPackId } = match.params;
    this.getProfileInfo(activityPackId);
    window.sessionStorage.setItem(CLICKED_ACTIVITY_PACK_ID, activityPackId);
  }

  UNSAFE_componentWillReceiveProps(nextProps: RouteComponentProps) {
    const { location } = this.props;
    const { params } = nextProps;
    const { activityPackId } = params;
    if (!_.isEqual(location, nextProps.location)) {
      this.setState({ loading: true, });
      this.getProfileInfo(activityPackId);
    }
  }

  getProfileInfo = (id: string) => {
    requestGet(`/teachers/unit_templates/profile_info?id=${id}`, (response: { data: UnitTemplateProfileInterface, referral_code: string }) => {
      this.displayUnit(response)
    })
  }

  displayUnit = (response: { data: UnitTemplateProfileInterface, referral_code: string }) => {
    const { data, referral_code } = response;
    this.setState({
      data,
      referralCode: referral_code,
      loading: false
    })
  }

  indexLink = () => {
    const { data } = this.state;
    const { non_authenticated } = data;
    return non_authenticated
      ? '/activities/packs'
      : '/assign/featured-activity-packs';
  }

  socialShareUrl = (referralCode: string) => {
    return `${window.location}${referralCode ? '?referral_code=' + referralCode : ''}`
  }

  socialText = (name: string, referralCode: string) => {
    return `Check out the '${name}' activity pack I just assigned on Quill.org! ${this.socialShareUrl(referralCode)}`
  }

  handleGoToEditStudents = () => {
    const { history } = this.props;
    const { data } = this.state;
    const { name, id, activities, } = data
    const activityIdsArray = activities.map((act: Activity) => act.id).toString()
    window.localStorage.setItem(UNIT_TEMPLATE_NAME, name)
    window.localStorage.setItem(UNIT_NAME, name)
    window.localStorage.setItem(ACTIVITY_IDS_ARRAY, activityIdsArray)
    window.localStorage.setItem(UNIT_TEMPLATE_ID, id)
    let link = `/assign/select-classes?unit_template_id=${id}`
    const collegeBoardActivityTypeSlug = parsedQueryParams()[COLLEGE_BOARD_SLUG]
    if (collegeBoardActivityTypeSlug) {
      link += `&${COLLEGE_BOARD_SLUG}=${collegeBoardActivityTypeSlug}`
    }

    history.push(link)
  }

  handleActivityClick = (e) => {
    const { target } = e
    const { id } = target
    redirectToActivity(id)
  }

  renderAssignButton = () => {
    return <button className="quill-button contained primary medium" onClick={this.handleGoToEditStudents} type="submit">Select pack</button>
  }

  renderMobileActivitiesList = ({ activities }) => {
    if(!activities) { return }

    return(
      <section className="mobile-activities-list-section">
        <h3>Activities</h3>
        <ul>
          {activities.map(activity => {
            const { id, name } = activity
            return <li><a className="interactive-wrapper" id={id} onClick={this.handleActivityClick}>{name}</a></li>
          })}
        </ul>
      </section>
    )
  }

  render() {
    const { data, loading, referralCode } = this.state

    if (loading) {
      return <LoadingIndicator />
    } else {
      let navigation: any;
      const { name, id, non_authenticated, flag } = data
      const showSocials = flag === 'production';
      if (!non_authenticated) {
        navigation = (<AssignmentFlowNavigation
          button={this.renderAssignButton()}
          unitTemplateId={id}
          unitTemplateName={name}
        />)
      }
      return (
        <div className="unit-template-profile">
          <ScrollToTop />
          {navigation}
          <div className="unit-template-profile-container">
            <h2>Activity Pack</h2>
            <h1>{name}</h1>
            <UnitTemplateProfileActivityTable data={data} />
            <div className="first-content-section flex-row space-between first-content-section">
              <div className="description">
                {this.renderMobileActivitiesList(data)}
                <UnitTemplateProfileDescription data={data} />
              </div>
              <div className="assign-buttons-and-standards">
                <UnitTemplateProfileDisclaimer data={data} />
                <UnitTemplateProfileStandards data={data} />
                {non_authenticated && <UnitTemplateAuthenticationButtons name={name} />}
                {showSocials && <UnitTemplateProfileShareButtons data={data} text={this.socialText(name, referralCode)} url={this.socialShareUrl(referralCode)} />}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default UnitTemplateProfile
