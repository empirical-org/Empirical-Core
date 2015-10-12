EC.ListFilterOptions = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired
  },

  generateViews: function () {
    var arr =_.map(this.props.options, this.generateView, this);
    return arr;
  },

  getKey: function (option) {
    return option.id;
  },

  generateView: function (option) {
    return <EC.ListFilterOption key={this.getKey(option)} data={option} select={this.props.select} />
  },

  render: function () {
    return (
      <div>
        {this.generateViews()}
      </div>
    );
  }
})