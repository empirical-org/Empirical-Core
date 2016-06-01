EC.ClassOverview = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {displayTeacherGuide: true};
  },

  hideTeacherGuide: function(){
    this.setState({displayTeacherGuide: false});
  },

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <EC.OverviewMini overviewObj={overviewObj} key={overviewObj.header}/>;
    });
    if (this.state.displayTeacherGuide){
      minis.unshift(<EC.TeacherGuide dashboardMini={true} hideTeacherGuide={this.hideTeacherGuide}/>);
    }
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
