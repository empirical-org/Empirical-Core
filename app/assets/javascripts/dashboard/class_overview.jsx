EC.ClassOverview = React.createClass({

  overviewMinis: function() {
    var minis = _.map(this.props.data, function(overviewObj){
      return <EC.OverviewMini overviewObj={overviewObj}/>;
    });
    return minis;
  },


  render: function() {
    return (
      <div className='row'>
        {this.overviewMinis()}
      </div>
    );
  }

});
