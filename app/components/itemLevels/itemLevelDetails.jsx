import React from 'react'
import {connect} from 'react-redux'
import levelActions from '../../actions/item-levels.js'
import {Link} from 'react-router'
import _ from 'lodash'

const ItemLevelDetails = React.createClass({

  render: function() {
    if(this.props.itemLevels.hasreceiveddata===true) {
      const levelID = this.props.params.itemLevelID, itemLevels = this.props.itemLevels.data

      const questions = this.props.questions.data, targetConceptID = itemLevels[levelID].conceptID
      const questionKeys = _.keys(questions).filter((key)=> {
        return questions[key].itemLevel===itemLevels[levelID].name && questions[key].conceptID===targetConceptID
      })
      const questionsToRender = questionKeys.map((key) => {
        return (<li key={key}><Link to={'/admin/questions/' + key}>{questions[key].prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
      })

      const questionsExist = questionsToRender.length===0 ? "There are no other questions associated with this level.\n" : "The following questions are also associated with this level:\n"
      return (
        <div className="box">
          <h1 className="menu-label">{"Name: " + itemLevels[levelID].name}</h1>
          <div className="menu-list">
            <p>{"Description: " + itemLevels[levelID].description}</p>
            <p>Asset URL: </p><a href={itemLevels[levelID].url}>{itemLevels[levelID].url}</a>
            <p>{"Associated grammar concept: " + this.props.concepts.data[targetConceptID].name}</p>
          </div>
          <br/>
          <p>{questionsExist}</p>
          <ul className="menu-list">{questionsToRender}</ul>
          <br />
          <Link to={"/admin/item-levels/" + levelID + "/edit"}><button className="button is-info">Edit Level</button></Link>
          <Link to={"/admin/item-levels"}><button className="button is-danger">Back</button></Link>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
})

function select(state) {
  return {
    routing: state.routing,
    itemLevels: state.itemLevels,
    concepts: state.concepts,
    questions: state.questions
  }
}
export default connect(select) (ItemLevelDetails)
