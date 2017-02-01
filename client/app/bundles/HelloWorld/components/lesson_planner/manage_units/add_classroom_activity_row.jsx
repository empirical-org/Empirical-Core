import React from 'react'
import {Link} from 'react-router'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}


export default React.createClass({

  render() {
    return (
			<div className='row' style={styles.row}>
        <Link to={`/units/${this.props.unitId}/activities/edit`}>Add New Activities</Link>
			</div>
		);
  }
})
