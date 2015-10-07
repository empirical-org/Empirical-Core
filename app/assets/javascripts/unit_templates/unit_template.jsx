EC.UnitTemplate = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className='unit-template'>
        <div className='row'>
          <div className='col-xs-6'>
            {this.props.data.number_of_standards}
          </div>
        </div>
      </div>

    );

  }

});