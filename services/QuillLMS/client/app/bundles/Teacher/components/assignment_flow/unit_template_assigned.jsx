'use strict'

import React from 'react'

import UnitTemplateProfileShareButtons from './unit_templates_manager/unit_template_profile/unit_template_profile_share_buttons'
import LoadingIndicator from '../shared/loading_indicator'
import { requestGet, } from '../../../../modules/request/index'

export default class UnitTemplateAssigned extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      data: null,
      lastUnitId: ''
    }
  }

  getDefaultProps() {
    // the only time we won't pass this is if they are assigning the diagnostic,
    // but actions shouldn't be undefined
    return {actions: {getInviteStudentsUrl(){'placeholder function'}}}
  }

  UNSAFE_componentWillMount() {
    requestGet(
      `${import.meta.env.DEFAULT_URL}/teachers/classrooms_i_teach_with_students`,
      (body) => {
        const studentsPresent = this.anyClassroomsWithStudents(body.classrooms)
        this.setState({ studentsPresent, loading: false, })
      }
    )

    requestGet(
      `${import.meta.env.DEFAULT_URL}/teachers/last_assigned_unit_id`,
      (body) => {
        this.setState({ lastUnitId: body.id, referralCode: body.referral_code, loading: false, })
      }
    )

    requestGet(
      `${import.meta.env.DEFAULT_URL}/teachers/unit_templates/assigned_info?id=${this.props.match.params.activityPackId}`,
      (body) => {
        this.setState({ data: body })
      }
    )
  }

  getInviteStudentsUrl() {
    return ('/teachers/classrooms');
  }

  activityName() {
    return this.state.data ? this.state.data.name : '';
  }

  anyClassroomsWithStudents(classrooms) {
    return !!classrooms.find((e) => e.students.length > 0)
  }

  socialShareCopy() {
    return `I’m using the ${this.activityName()} Activity Pack from Quill.org to teach writing & grammar. ${this.socialShareUrl()}`;
  }

  socialShareUrl() {
    return `${window.location.origin}/activities/packs/${this.props.match.params.activityPackId}${this.state.referralCode ? '?referral_code=' + this.state.referralCode : ''}`;
  }

  teacherSpecificComponents() {
    let href;
    let text;

    if (this.props.type === 'diagnostic' || this.state.studentsPresent) {
      href = `/teachers/classrooms/activity_planner#${this.state.lastUnitId}`;
      text = 'View Assigned Activity Packs';
    } else {
      href = this.getInviteStudentsUrl();
      text = 'Add Students'
    }

    return (
      <span>
        <a href={href}>
          <button className="button-green add-students pull-right">
            {text} <i className="fas fa-long-arrow-alt-right" />
          </button>
        </a>
      </span>
    )
  }

  unitTemplatesAssignedActions() {
    return {studentsPresent: this.props.students, getInviteStudentsUrl: this.getInviteStudentsUrl};
  }

  renderSharingContainer() {
    return (
      <div className='sharing-container'>
        <h2>
        Share Quill With Your Colleagues
        </h2>
        <p className='nonprofit-copy'>
        We’re a nonprofit providing free literacy activities. The more people <br />
        who use Quill, the more free activities we can create.
        </p>
        <p className='social-copy'>
          <i>{this.socialShareCopy()}</i>
        </p>
        <div className='container'>
          <UnitTemplateProfileShareButtons text={this.socialShareCopy()} url={this.socialShareUrl()} />
        </div>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return(<LoadingIndicator />);
    }

    $('html,body').scrollTop(0);
    return (
      <div className='assign-success-container'>
        <div className='successBox'>
          <div className='container'>
            <div className='row' id='successBoxMessage'>
              <div className='col-md-9 successMessage'>
                <i className="fas fa-check-circle pull-left" /> You’ve successfully assigned the <strong>{this.activityName()}</strong> Activity Pack!
              </div>
              <div className='col-md-4'>
                {this.teacherSpecificComponents()}
              </div>
            </div>
          </div>
        </div>
        {this.renderSharingContainer()}
      </div>
    );
  }
}
