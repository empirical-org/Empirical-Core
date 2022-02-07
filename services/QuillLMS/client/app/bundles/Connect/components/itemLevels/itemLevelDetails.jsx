import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import _ from 'lodash'

class ItemLevelDetails extends React.Component {
  render() {
    if(this.props.itemLevels.hasreceiveddata) {
      const levelID = this.props.params.itemLevelID, itemLevels = this.props.itemLevels.data

      const questions = this.props.questions.data
      const questionKeys = _.keys(questions).filter((key)=> {
        return questions[key].itemLevel===itemLevels[levelID].name
      })
      const questionsToRender = questionKeys.map((key) => {
        return (<li key={key}><Link to={'/admin/questions/' + key}>{questions[key].prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
      })

      const questionsExist = questionsToRender.length===0 ? "There are no other questions associated with this level.\n" : "The following questions are also associated with this level:\n"
      return (
        <div className="box">
          <h1 className="menu-label">{"Name: " + itemLevels[levelID].name}</h1>
          <div className="menu-list">
            <p>{"Integer value: " + itemLevels[levelID].integerValue}</p>
          </div>
          <br />
          <p>{questionsExist}</p>
          <ul className="menu-list">{questionsToRender}</ul>
          <br />
          <Link to={"/admin/item-levels/" + levelID + "/edit"}><button className="button is-info">Edit Level</button></Link>
          <Link to="/admin/item-levels"><button className="button is-danger">Back</button></Link>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}

function select(state) {
  return {
    routing: state.routing,
    itemLevels: state.itemLevels,
    questions: state.questions
  }
}
export default connect(select) (ItemLevelDetails)
