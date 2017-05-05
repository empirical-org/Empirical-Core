import React from 'react'
import { Link } from 'react-router'

const QuestionListItem = (props) => (
  <li>
    <Link to={'/' + props.baseRoute + '/questions/' + props.questionKey} activeClassName="is-active">
      <div className="columns">
        <div className="column">
          <span>{props.prompt}</span>
        </div>

        <div className="column is-1">
          {props.responseCount}
        </div>
      </div>
    </Link>
  </li>
)

export default QuestionListItem
