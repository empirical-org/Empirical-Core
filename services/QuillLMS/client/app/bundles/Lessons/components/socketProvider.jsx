import React from 'react';
import { getParameterByName } from '../libs/getParameterByName';
import socket from '../utils/socketStore';

class SocketProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = { socketOpened: false }
  }

  componentDidMount() {
    const callback = () => {
      this.setState({ socketOpened: true })
    };

    const classroomUnitId = getParameterByName('classroom_unit_id');

    socket.connect(classroomUnitId, callback)
  }

  render() {
    if (this.state.socketOpened) {
      return this.props.children;
    } else {
      return false;
    }
  }
}

export default SocketProvider;
