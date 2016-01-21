'use strict';

EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState : function() {
    return {
      loadingSpinner: true
    };
  },

  hideSubNavBars: function() {
    $(".unit-tabs").hide();
    $(".tab-outer-wrap").hide();
    $(".section-content-wrapper").hide();
  },

  activityName: function() {
    return this.props.data.name;
  },

  render: function () {
    $('html,body').scrollTop(0);
    var socialButtons = <EC.UnitTemplateProfileShareButtons data={this.props.data} />
    return (
      <div className='assign-success-container'>

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
        <EC.UnitTemplateProfileShareButtons data={this.props.data} />
      </div>
    </div>
    </div>
  );
  }
});
