'use strict';
EC.StudentProfileUnits = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    var units = _.reduce(this.props.data, function (acc, value, key) {
      var x = <EC.StudentProfileUnit key={key} data={_.extend(value, {unitName: key})} />
      return _.chain(acc).push(x).value()
    }, []);
    return (
      <div className='container'>
        {units}
      </div>
    );
  }
})
