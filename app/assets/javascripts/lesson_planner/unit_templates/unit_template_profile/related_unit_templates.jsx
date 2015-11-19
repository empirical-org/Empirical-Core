EC.RelatedUnitTemplates = React.createClass({
  propTypes: {
    models: React.PropTypes.array.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  miniView: function (model, index) {
    var className;
    if (index === 0) {
      className = 'col-xs-6 no-pr'
    } else {
      className = 'col-xs-6 no-pl'
    }

    return (
      <div className={className}>
        <EC.UnitTemplateMini
              data={model}
              key={model.id}
              eventHandlers={this.props.eventHandlers}
              index={index} />
      </div>
    )
  },

  render: function () {
    var cols = _.map(this.props.models.slice(0,2), this.miniView);
    return (
      <span>
        <div className='row'>
          <div className='col-xs-12 no-pl'>
            <h3>
              Other Activity Packs You Might Love
            </h3>
          </div>
        </div>
        <div className='row'>
          {cols}
        </div>
      </span>
    )
  }
})