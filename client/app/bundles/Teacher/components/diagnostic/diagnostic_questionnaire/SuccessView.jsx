import React from 'react'
import request from 'request'
import UnitTemplateAssigned from '../../lesson_planner/diagnostic_assigned.jsx'


export default class SuccessView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentWillMount() {
    request.get({
      url: `${process.env.DEFAULT_URL}/activities/${this.props.params.activityId}/last_unit_template`
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      this.setState(parsedBody)
    });

  }

  render() {
    const { name, id, } = this.state
    return (
      <UnitTemplateAssigned data={{name, id}} type={'diagnostic'}/>
    );
   }
 }
