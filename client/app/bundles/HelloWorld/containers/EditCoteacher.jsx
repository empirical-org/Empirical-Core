import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

export default React.createClass({

  handleSelect: function(coteacher) {
    this.setState({coteacher: coteacher});
  },

  generateMenuItems: function() {
    debugger
    return this.props.classrooms.map(c=> <MenuItem key={c.id} eventKey={c.id}>{c.name}</MenuItem>)
  },

  render: function() {
    return (
      <div>
        <h1>Edit Co-Teachers</h1>
         <label>Select Co-Teacher:</label>
         <DropdownButton bsStyle='default' title={'test'} id='select-role-dropdown' onSelect={this.handleSelect}>
           {this.generateMenuItems()}
         </DropdownButton>
      </div>
    )
   }
 });
