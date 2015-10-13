EC.ListFilterOptions = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired,
    //selectedId: null | number
  },

  generateViews: function () {
    var allOption = {
      id: null,
      name: 'All'
    };
    var options = [allOption].concat(this.props.options)
    var arr =_.map(options, this.generateView, this);
    return arr;
  },

  getKey: function (option) {
    return option.id;
  },

  isSelected: function (option) {
    return (this.props.selectedId === option.id)
  },

  generateView: function (option) {
    return <EC.ListFilterOption
                    key={this.getKey(option)}
                    data={option}
                    isSelected={this.isSelected(option)}
                    select={this.props.select} />
  },

  render: function () {
    return (
      <div className='list-filter-options'>
        {this.generateViews()}
      </div>
    );
  }
})