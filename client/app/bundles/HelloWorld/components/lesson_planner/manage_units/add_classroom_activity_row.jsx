import React from 'react'
import {Link} from 'react-router'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px'
  }
}




export default React.createClass({
  unitNameURIString() {
     return this.props.unitName ? `/${encodeURIComponent(this.props.unitName)}` : '';
  },


  render() {
    return (
			<div className='row' style={styles.row}>
        <Link to={`/units/${this.props.unitId}/activities/edit${this.unitNameURIString()}`}>Add More Activities</Link>
			</div>
		);
  }
})
