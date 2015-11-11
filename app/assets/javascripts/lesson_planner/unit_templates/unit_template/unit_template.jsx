EC.UnitTemplate = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  assign: function () {
    this.props.eventHandlers.assign(this.props.data.model);
  },

  render: function () {
    return (
      <div>
        <div>{this.props.data.model.name}</div>
        <button className='button-green' onClick={this.assign}>assign</button>
        <EC.RelatedUnitTemplates models={this.props.data.relatedModels}
                                 eventHandlers={this.props.eventHandlers} />
        <div className='row'>
          <div className='center-block'>
            <button onClick={this.props.eventHandlers.returnToIndex} className='button-grey button-dark-grey'>See All Activity Packs</button>
          </div>
        </div>
      </div>
    );
  }
});