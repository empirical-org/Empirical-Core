EC.ClassOverview = React.createClass({

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <EC.OverviewMini overviewObj={overviewObj} key={overviewObj.header}/>;
    });
    return minis;
  },

  hasPremium: function() {
    if (this.props.premium === false) {
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
