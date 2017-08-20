import React, {Component} from 'react'
import { connect } from 'react-redux';

class showScriptItem extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        Script Item
      </div>
    )
  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(showScriptItem)
