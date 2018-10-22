'use strict'

import React from 'react'
import $ from 'jquery'
import UnitTemplateProfileShareButtons from './unit_templates_manager/unit_template_profile/unit_template_profile_share_buttons'
import LoadingIndicator from '../shared/loading_indicator'

export default class UnitTemplateAssigned extends React.Component {

  getInitialState() {
    return {
      loading: true,
      data: null,
      lastUnitId: ''
    }
  }

  getInviteStudentsUrl() {
    return ('/teachers/classrooms/invite_students');
  }

  unitTemplatesAssignedActions() {
    return {studentsPresent: this.props.students, getInviteStudentsUrl: this.getInviteStudentsUrl};
  }

  getDefaultProps() {
    // the only time we won't pass this is if they are assigning the diagnostic,
    // but actions shouldn't be undefined
    return {actions: {getInviteStudentsUrl(){'placeholder function'}}}
  }

  anyClassroomsWithStudents(classrooms) {
    return !!classrooms.find((e) => e.students.length > 0)
  }

  componentWillMount() {
    const that = this;
      $.ajax({
        url: '/teachers/classrooms_i_teach_with_students',
        dataType: 'json',
        success(data) {
          that.setState({loading: false, studentsPresent: that.anyClassroomsWithStudents(data.classrooms) });
        }
      });
      $.ajax({
        url: '/teachers/unit_templates/assigned_info',
        data: {id: this.props.params.activityPackId},
        dataType: 'json',
        success(data) {
          that.setState({data})
        }
      })
      $.ajax({
        url: '/teachers/last_assigned_unit_id',
        dataType: 'json',
        success(data) {
          that.setState({
            loading: false,
            lastUnitId: data.id,
            referralCode: data.referral_code
          });
        }
      });
  }

  activityName() {
    return this.state.data ? this.state.data.name : '';
  }

  socialShareUrl() {
    return `${window.location.origin}/activities/packs/${this.props.params.activityPackId}${this.state.referralCode ? '?referral_code=' + this.state.referralCode : ''}`;
  }

  socialShareCopy() {
    return `I’m using the ${this.activityName()} Activity Pack from Quill.org to teach writing & grammar. ${this.socialShareUrl()}`;
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
                {text} <i className="fa fa-long-arrow-right"></i>
              </button>
            </a>
      </span>
    )
  }

  renderSharingContainer() {
    const { name, id } = this.state.data
    if (name && id) {
      return <div className='sharing-container'>
        <h2>
          Share Quill With Your Colleagues
        </h2>
        <p className='nonprofit-copy'>
          We’re a nonprofit providing free literacy activities. The more people <br></br>
          who use Quill, the more free activities we can create.
        </p>
        <p className='social-copy'>
          <i>{this.socialShareCopy()}</i>
        </p>
        <div className='container'>
          <UnitTemplateProfileShareButtons text={this.socialShareCopy()} url={this.socialShareUrl()} />
        </div>
      </div>
    }
  }

  render() {
    if(this.state.loading) {
      return(<LoadingIndicator />);
    }

    $('html,body').scrollTop(0);
    return (
      <div className='assign-success-container'>
    <div className='successBox'>
      <div className='container'>
        <div className='row' id='successBoxMessage'>
          <div className='col-md-9 successMessage'>
            <i className="fa fa-check-circle pull-left"></i> You’ve successfully assigned the <strong>{this.activityName()}</strong> Activity Pack!
          </div>
          <div className='col-md-4'>
            {this.teacherSpecificComponents()}
          </div>
        </div>
      </div>
    </div>
    {this.renderSharingContainer}
    </div>
  );
  }
}
