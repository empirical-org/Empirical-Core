EC.UnitTemplate = React.createClass({
  propTypes: {
    model: React.PropTypes.object.isRequired,
    assign: React.PropTypes.func.isRequired,
    returnToIndex: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {};
  },

  assign: function () {
    this.props.assign(this.props.model);
  },

  render: function () {
    return (
      <div>
        <div onClick={this.props.returnToIndex}>return to index</div>
        <div>{this.props.model.name}</div>
        <button className='button-green' onClick={this.assign}>assign</button>
      </div>
    );
  }
});