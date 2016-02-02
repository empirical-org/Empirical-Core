EC.OverviewMini = React.createClass({

  overviewMiniBuilder: function() {
    results = this.props.overviewObj.results;
    var leftColumn = Object.keys(results);
    var dataRows = _.map(leftColumn, function(left) {
      return (<tr>
                <td>{left}</td>
                <td>{results[left]}</td>
              </tr>);
    });
    return (
      dataRows
    );
  },

  header: function() {
    return <h3>{this.props.overviewObj.header}</h3>;
  },

  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className ={"mini_content "}>
          {this.header()}
          {this.overviewMiniBuilder()}
        </div>
      </div>
    );
  }
});
