import openSocket from 'socket.io-client'

class SocketStore {
  constructor(){
    this.instance = null;
    this.classroomActivityId = null;
    this.tokenUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons_tokens`;
    this.socketUrl = 'http://localhost:8000';
  }

  _requestAuthToken() {
    let requestData = JSON.stringify({
      classroom_activity_id: this.classroomActivityId
    });
    let body = new FormData();
    let request = new XMLHttpRequest();

    body.append('json', requestData);
    request.open('POST', this.tokenUrl, false);
    request.send(body);

    if (request.status === 200) {
      return JSON.parse(request.responseText);
    } else {
      console.log(request)
    }
  }

  _createSocket(token) {
    let socket = openSocket(this.socketUrl, {
      query: { token }
    });
    this.instance = socket;
    console.log(this.instance)
  }

  connect(newClassroomActivityId = null) {
    let isSocketMissing      = !this.classroomActivityId && !this.instance
    let isNewActivitySession = this.classroomActivityId !== newClassroomActivityId
    let canCreateSocket      = isSocketMissing || isNewActivitySession

    if (canCreateSocket) {
      let data = this._requestAuthToken();
      this.classroomActivityId = newClassroomActivityId;

      if (data && data.token) {
        this._createSocket(data.token);
      }
    }
  }
}

const instance = new SocketStore();

export default instance;
