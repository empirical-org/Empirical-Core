import React from 'react';
import $ from 'jquery';
import AnalyticsWrapper from '../../../shared/analytics_wrapper';
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      fastAssignDisabled: false,
    };
  },

  analytics() {
    return new AnalyticsWrapper();
  },

  goToEditStudents() {
    const ut = this.props.data;
    const name = encodeURIComponent(ut.name);
    const activityIds = encodeURIComponent(ut.activities.map(act => act.id).toString());
    window.location = `/teachers/classrooms/assign_activities/new_unit/students/edit/name/${name}/activity_ids/${activityIds}?unit_template_id=${ut.id}`;
  },

  fastAssign() {
    this.setState({ fastAssignDisabled: true, });
    $.ajax({
      url: '/teachers/unit_templates/fast_assign',
      data: {
        id: this.props.data.id,
      },
      type: 'POST',
      success: this.onFastAssignSuccess,
      error: (response) => {
        const errorMessage = jQuery.parseJSON(response.responseText).error_message;
        window.alert(errorMessage);
      },
    });
  },

  onFastAssignSuccess() {
    this.analytics().track('click Create Unit', {});
    window.location = `/teachers/classrooms/assign_activities/featured-activity-packs/${this.props.data.id}/assigned`;
  },

  propsSpecificComponent() {
    if (this.props.data.non_authenticated) {
      return <a href="/account/new"><button className="button-green full-width">Sign Up to Assign This Activity Pack</button></a>;
    } else if (this.state.fastAssignDisabled) {
      return (
        <span>
          <button className="button-green full-width" disabled>Assign to All Students <ButtonLoadingIndicator /></button>
          <button className="button-green full-width" disabled>Customize Students</button>
        </span>
      );
    }
    return (<span>
      <button className="button-green full-width" onClick={this.fastAssign}>Assign to All Students</button>
      <button className="button-green full-width" onClick={this.goToEditStudents}>Customize Students</button>
    </span>);
  },

  render() {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className="fa fa-clock-o" />Estimated Time: {this.props.data.time} mins</p>
      </div>
    );
  },
});
