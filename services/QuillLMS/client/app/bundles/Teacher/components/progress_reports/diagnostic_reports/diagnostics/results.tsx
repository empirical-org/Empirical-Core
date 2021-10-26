import * as React from 'react'
import { withRouter, } from 'react-router-dom';

import { Classroom, Activity, Diagnostic, } from './interfaces'

const Results = ({ classrooms, }) => {

  return (<section className="results-summary-container">
    <h1>Results summary</h1>
  </section>
  )
}

export default withRouter(Results)
