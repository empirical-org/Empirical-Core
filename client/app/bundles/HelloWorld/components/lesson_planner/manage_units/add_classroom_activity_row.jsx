import React from 'react'
import {Link} from 'react-router'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
    border: '2px dashed #dad9d9'
  }
}




export default React.createClass({
  unitNameURIString() {
     return this.props.unitName ? `/${encodeURIComponent(this.props.unitName)}` : '';
  },


  render() {
    return (
			<div className='row' style={styles.row}>
        <Link className='q-button bg-white text-black' to={`/units/${this.props.unitId}/activities/edit${this.unitNameURIString()}`}>
          <span className='fa fa-plus'/>Add More Activities
        </Link>
			</div>
		);
  }
})
