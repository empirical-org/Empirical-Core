import React from 'react'
import {connect} from 'react-redux'
import ItemLevelForm from './itemLevelForm.jsx'

const ItemLevel = React.createClass({

  render: function() {
    // this.props.params has the ID of the current itemLevel. this.props.itemLevels.data has all the itemLevels
    let data=this.props.itemLevels.data[this.props.params.itemLevelID]
    console.log(this.props)
    return (
      <ItemLevelForm data={data} mode="Edit"/>
    )
  }
})

function select(state) {
  return {
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(ItemLevel)
