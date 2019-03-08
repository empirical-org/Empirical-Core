import React from 'react'
import request from 'request'
import ClassroomPage from './ClassroomPage.jsx'
import IntroPage from './IntroPage.jsx'
import StatusBar from './StatusBar.jsx'
import ModalOverview from './ModalOverview.jsx'
import LoadingIndicator from '../../shared/loading_indicator'

export default class Stages extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentWillMount() {
    request.get({
      url: `${process.env.DEFAULT_URL}/activities/${this.props.params.activityId}/name_and_id`
    },
    (e, r, body) => {
      const parsedBody = JSON.parse(body)
      this.setState(parsedBody)
    });

  }

  stage(){
    if (this.state.id) {
      let stage
      if (this.props.params.stage === '1'){
        stage = <ModalOverview diagnosticName={this.state.name} diagnosticActivityId={this.state.id}/>
      } else if (this.props.params.stage === '3') {
        stage = <ClassroomPage diagnosticName={this.state.name} diagnosticActivityId={this.state.id}/>
      } else {
        stage = <IntroPage diagnosticName={this.state.name} diagnosticActivityId={this.state.id}/>
      }
      return stage
    } else {
      return <LoadingIndicator />
    }
  }


  render() {
    const topSection = <div style={{height: '20px'}}/>
    return (
      <div id='diagnostic-planner-status-bar'>
        {topSection}
        <div className='diagnostic-planner-body'>
          {this.stage()}
       </div>
     </div>
    );
   }
 }
