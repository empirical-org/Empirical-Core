'use strict'

 import React from 'react'
 import $ from 'jquery'
 import UnitTemplateProfileShareButtons from './unit_templates_manager/unit_template_profile/unit_template_profile_share_buttons'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  hideSubNavBars: function() {
    $(".unit-tabs").hide();
    $(".tab-outer-wrap").hide();
    $(".section-content-wrapper").hide();
  },

  activityName: function() {
    return this.props.data.name;
  },

  teacherSpecificComponents: function() {
    this.hideSubNavBars();
    var proceedButton;
    if (this.props.actions.studentsPresent) {
      proceedButton = (
        <span>
            <a href = '/teachers/classrooms/lesson_planner'>
              <button onClick className="button-green add-students pull-right">
                View Assigned Activity Packs <i className="fa fa-long-arrow-right"></i>
              </button>
            </a>
        </span>);
    } else {
      proceedButton = (
        <span>
            <a href = {this.props.actions.getInviteStudentsUrl()} >
              <button onClick className="button-green add-students pull-right">
                Add Students <i className="fa fa-long-arrow-right"></i>
              </button>
            </a>
        </span>);
    };
    return (proceedButton);
  },

  // socialButtons: function() {
  //   return
  // },

  // <div className='row'>
  //   <div className='twitter-button col-md-1 col-md-offset-2'>Tweet</div>
  //   <div className='facebook-button col-md-1'>Tweet</div>
  //   <div className='pinterest-button col-md-1'>Tweet</div>
  //   <div className='google-plus-button col-md-1'>Tweet</div>
  // </div>


  // <div className='col-md-7 assign-success-message pull-left'>
  //   You’ve successfully assigned the <strong>{this.activityName()}</strong> Activity Pack!
  // </div>

  render: function () {
    $('html,body').scrollTop(0);
    return (
      <div className='assign-success-container'>
    <div className='successBox'>
      <div className='container'>
        <div className='row' id='successBoxMessage'>
          <div className='col-md-9 successMessage'>
            <i className="fa fa-check-circle pull-left"></i>You’ve successfully assigned the <strong>{this.activityName()}</strong> Activity Pack!
          </div>
          <div className='col-md-4'>
            {this.teacherSpecificComponents()}
          </div>
        </div>
      </div>
    </div>
    <div className='sharing-container'>
      <h2>
        Share Quill With Your Colleagues
      </h2>
        <p className='nonprofit-copy'>
          We’re a nonprofit providing free literacy activities. The more people <br></br>
          that use Quill, the more free activities we can create.
        </p>
      <p className='social-copy'>
        <i>I’m using the {this.activityName()} Activity Pack, from Quill.org, to teach English grammar. quill.org/activity_packs/3</i>
      </p>
      <div className='container'>
        <UnitTemplateProfileShareButtons data={this.props.data} />
      </div>
    </div>
    </div>
  );
  }
});
