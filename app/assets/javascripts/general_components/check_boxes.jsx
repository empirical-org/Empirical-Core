EC.CheckBoxes = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired,
    toggleItem: React.PropTypes.func.isRequired
  },

  generateCheckBox: function () {

  },

  render: function () {
    var checkBoxes = _.map(this.props.items, this.generateCheckBox, this);
    return <span>checkBoxes</span>;
  }
});