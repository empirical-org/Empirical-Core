'use strict';
EC.CheckBox = React.createClass({
  propTypes: {
    toggleItem: React.PropTypes.func.isRequired,
    item: React.PropTypes.object.isRequired
  },

  handleChange: function () {

  },

  generateCheckbox: function (item) {
    return ( <input type="checkbox"
                   checked="checked"
                   className="css-checkbox"
                   id={"item_" + item.id}
                   onChange={this.handleChange} />
    );
  },

  render: function () {
    return this.generateCheckbox();
  }
});
