'use strict'

EC.AssignmentTypeMini = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    img: React.PropTypes.string.isRequired,
    bodyText: React.PropTypes.string.isRequired,
    directions: React.PropTypes.string.isRequired,
    routeToGetQuantity: React.PropTypes.string.isRequired,
    unit: React.PropTypes.string.isRequired,
    timeDuration: React.PropTypes.string.isRequired,
  },

  quantity: function(){
    // $.ajax(.....)
  },

  render: function(){
    var unit = this.props.unit
    return <div className='assignment-type-mini'>
      <h3>{this.props.title}</h3>
      <img src={this.props.img} alt="assignment-type-image"/>
      <p className='overview'>{this.props.bodyText}</p>
      <div className='meta-info-wrapper'>
        <span clasName='directions'>{this.props.directions}</span>
        <br/>
        {this.quantity() + ' ' + unit + 's' + ' | ' + this.props.timeDuration + ' ' + 'per ' +  unit.charAt(0).toUpperCase() + unit.slice(1)}
      </div>
    </div>
  }
})
