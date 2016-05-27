EC.ClassOverview = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <EC.OverviewMini overviewObj={overviewObj} key={overviewObj.header}/>;
    });
    minis.unshift(<EC.TeacherGuide dashboardMini={true}/>);
    return minis;
  },

  hasPremium: function() {
    if (this.props.data !== null && (this.props.premium === 'none') || (this.props.premium === null)) {
      return <EC.PremiumMini/>;
    }
  },


  render: function() {
    return (
      <div className='row'>
        {this.overviewMinis()}
        {this.hasPremium()}
      </div>
    );
  }

});
